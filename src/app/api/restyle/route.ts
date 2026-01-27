import { NextRequest, NextResponse } from 'next/server'

const API_TOKEN = process.env.REPLICATE_API_TOKEN
const BASE_URL = 'https://api.replicate.com/v1'

async function pollForResults(predictionId: string): Promise<any> {
  const maxAttempts = 120 // 10 minutes with 5s intervals
  let attempts = 0

  while (attempts < maxAttempts) {
    const response = await fetch(`${BASE_URL}/predictions/${predictionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to poll for results')
    }

    const result = await response.json()

    if (result.status === 'succeeded') {
      return result
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'Prediction failed')
    }

    // Wait 5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 5000))
    attempts++
  }

  throw new Error('Prediction timed out')
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    if (!API_TOKEN) {
      return NextResponse.json({ error: 'API token not configured' }, { status: 500 })
    }

    const prompt = 'update the lighting prompt for this image covered under intense, direct midday sun from high above, creating high-contrast, razor-sharp shadows and bright, brilliant highlights. With green elements'

    // Ensure image is a proper data URI
    const imageDataUri = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`

    // Start prediction with Seedream 4.5
    const startResponse = await fetch(`${BASE_URL}/models/bytedance/seedream-4.5/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          size: '4K',
          width: 2048,
          height: 2048,
          prompt: prompt,
          max_images: 1,
          image_input: [imageDataUri],
          aspect_ratio: '1:1',
          sequential_image_generation: 'disabled',
        },
      }),
    })

    if (!startResponse.ok) {
      const errorData = await startResponse.json()
      console.error('Replicate API error:', errorData)
      return NextResponse.json(
        { error: errorData.detail || 'Failed to start prediction' },
        { status: startResponse.status }
      )
    }

    const prediction = await startResponse.json()

    // Poll for results
    const result = await pollForResults(prediction.id)

    // Extract output URL
    let outputUrl = null
    if (Array.isArray(result.output)) {
      outputUrl = result.output[0]
    } else if (typeof result.output === 'string') {
      outputUrl = result.output
    } else if (result.output?.url) {
      outputUrl = result.output.url
    }

    if (!outputUrl) {
      return NextResponse.json({ error: 'No output received' }, { status: 500 })
    }

    return NextResponse.json({ outputUrl })
  } catch (error) {
    console.error('Restyle API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
