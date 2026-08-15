import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReserveSlotRequest {
  serviceId: string
  date: string // YYYY-MM-DD format
  slotTime: string | null
  name: string
  email: string
  phone: string
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData: ReserveSlotRequest = await req.json()
    const { serviceId, date, slotTime, name, email, phone, message } = requestData

    console.log('Reserve slot request:', { serviceId, date, slotTime, name, email })

    // Validate required fields
    if (!serviceId || !date || !name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Start atomic transaction-like operation
    // Step 1: Check if the service exists and is active
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('active', true)
      .single()

    if (serviceError || !service) {
      console.error('Service not found:', serviceError)
      return new Response(
        JSON.stringify({ error: 'Service not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Get or create booking_date record
    const { data: bookingDate, error: bookingDateError } = await supabase
      .from('booking_dates')
      .select('*')
      .eq('service_id', serviceId)
      .eq('date', date)
      .maybeSingle()

    if (bookingDateError) {
      console.error('Error fetching booking date:', bookingDateError)
      return new Response(
        JSON.stringify({ error: 'Error checking availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if date is available
    if (bookingDate && !bookingDate.available) {
      return new Response(
        JSON.stringify({ error: 'This date is not available' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If slots are specified, check slot availability
    if (slotTime && bookingDate) {
      const slots = bookingDate.slots as Array<{time: string, available: boolean}>
      const requestedSlot = slots.find(s => s.time === slotTime)
      
      if (!requestedSlot) {
        return new Response(
          JSON.stringify({ error: 'Slot not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!requestedSlot.available) {
        return new Response(
          JSON.stringify({ error: 'Slot already booked' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Step 3: Check for conflicting bookings
    const { data: existingBookings, error: bookingCheckError } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_id', serviceId)
      .eq('booking_date', date)
      .eq('slot_time', slotTime || '')
      .in('status', ['pending', 'confirmed'])

    if (bookingCheckError) {
      console.error('Error checking existing bookings:', bookingCheckError)
      return new Response(
        JSON.stringify({ error: 'Error checking availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingBookings && existingBookings.length > 0) {
      return new Response(
        JSON.stringify({ error: 'This slot was just booked by someone else' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 4: Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        service_id: serviceId,
        name,
        email,
        phone,
        booking_date: date,
        slot_time: slotTime,
        status: 'pending',
        payment_status: 'unpaid',
        message: message || null
      })
      .select()
      .single()

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError)
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 5: Update slot availability if slot was specified
    if (slotTime && bookingDate) {
      const slots = bookingDate.slots as Array<{time: string, available: boolean}>
      const updatedSlots = slots.map(s => 
        s.time === slotTime ? { ...s, available: false } : s
      )

      const { error: updateError } = await supabase
        .from('booking_dates')
        .update({ slots: updatedSlots })
        .eq('id', bookingDate.id)

      if (updateError) {
        console.error('Error updating slot availability:', updateError)
        // Booking was created but slot update failed - log for manual review
        console.warn('MANUAL REVIEW NEEDED: Booking created but slot update failed', {
          bookingId: booking.id,
          dateId: bookingDate.id
        })
      }
    }

    console.log('Booking created successfully:', booking.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        message: 'Booking created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in reserve-slot function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
