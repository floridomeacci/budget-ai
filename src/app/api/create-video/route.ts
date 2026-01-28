import { NextRequest, NextResponse } from 'next/server'

// POST - Start video generation (returns prediction ID for polling)
export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImageUrl } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
    }

    // Build the input object for Veo 3.1
    const input: {
      prompt: string
      duration: number
      resolution: string
      aspect_ratio: string
      generate_audio: boolean
      reference_images?: string[]
    } = {
      prompt,
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16', // Vertical video for social media
      generate_audio: true,
    }

    // Add reference image if provided (as array of URL strings)
    if (referenceImageUrl) {
      input.reference_images = [referenceImageUrl]
    }

    // Create prediction - returns immediately
    const createResponse = await fetch('https://api.replicate.com/v1/models/google/veo-3.1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    })

    const prediction = await createResponse.json()

    if (!createResponse.ok) {
      console.error('Replicate API error:', prediction)
      return NextResponse.json({ 
        error: prediction.detail || prediction.error || 'Failed to start video generation' 
      }, { status: createResponse.status })
    }

    // Return prediction ID immediately - frontend will poll for status
    return NextResponse.json({ 
      success: true, 
      predictionId: prediction.id,
      status: prediction.status
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    }, { status: 500 })
  }
}

// GET - Check prediction status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const predictionId = searchParams.get('id')

    if (!predictionId) {
      return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 })
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json({ 
        error: result.detail || 'Failed to get prediction status' 
      }, { status: response.status })
    }

    return NextResponse.json({
      status: result.status,
      output: result.output,
      error: result.error
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to check status' 
    }, { status: 500 })
  }
}
