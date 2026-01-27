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
    const { prompt, imageBase64, aspectRatio = '1:1' } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!imageBase64) {
      return NextResponse.json({ error: 'Reference image is required' }, { status: 400 })
    }

    if (!API_TOKEN) {
      return NextResponse.json({ error: 'API token not configured' }, { status: 500 })
    }

    // Clean prompt and add restyle lighting
    const restylePrompt = 'covered under intense, direct midday sun from high above, creating high-contrast, razor-sharp shadows and bright, brilliant highlights. With green elements'
    const cleanPrompt = `${prompt.replace(/\n/g, ' ').replace(/"/g, '\\"')}. ${restylePrompt}`

    // Ensure image is a proper data URI
    const imageDataUri = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`

    // Generate 4 images by making 4 parallel API calls
    const generateOne = async (index: number): Promise<string | null> => {
      try {
        // Add slight variation to prompt for each image
        const variedPrompt = `${cleanPrompt} (variation ${index + 1})`
        
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
              prompt: variedPrompt,
              max_images: 1,
              image_input: [imageDataUri],
              aspect_ratio: aspectRatio,
              sequential_image_generation: 'disabled',
            },
          }),
        })

        if (!startResponse.ok) {
          console.error(`Failed to start prediction ${index}`)
          return null
        }

        const prediction = await startResponse.json()
        const result = await pollForResults(prediction.id)

        if (Array.isArray(result.output) && result.output.length > 0) {
          return result.output[0]
        } else if (typeof result.output === 'string') {
          return result.output
        }
        return null
      } catch (err) {
        console.error(`Error generating image ${index}:`, err)
        return null
      }
    }

    // Run 4 generations in parallel
    const results = await Promise.all([
      generateOne(0),
      generateOne(1),
      generateOne(2),
      generateOne(3),
    ])

    const outputUrls = results.filter((url): url is string => url !== null)

    if (outputUrls.length === 0) {
      return NextResponse.json({ error: 'No images generated' }, { status: 500 })
    }

    return NextResponse.json({ outputUrls })
  } catch (error) {
    console.error('Create Photo API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
