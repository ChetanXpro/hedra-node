# Hedra API Client (Unofficial)

A Node.js client for the Hedra API, enabling character video generation using AI.

## Installation

```bash
npm install hedra
```

## Quick Start

```typescript
import { HedraClient } from 'hedra';
import fs from 'fs';

const client = new HedraClient('your-api-key');

async function generateVideo() {

  const audioUpload = await client.uploadAudio(fs.readFileSync('audio.wav'));
  const imageUpload = await client.uploadImage(fs.readFileSync('image.jpg'), '16:9');

 
  const generation = await client.generateCharacter({
    aspectRatio: '16:9',
    audioSource: 'audio',
    voiceUrl: audioUpload.url,
    avatarImage: imageUpload.url,
  });


  const completedProject = await client.waitForProjectCompletion(
    generation.jobId,
    (status) => console.log('Status:', status)
  );

  if (completedProject.videoUrl) {
    await client.downloadVideo(completedProject.videoUrl, 'output.mp4');
    console.log('Video downloaded to output.mp4');
  }
}

generateVideo().catch(console.error);
```

## Key Features

- Audio and image upload
- Character video generation
- Project status tracking
- Video download
- Project management (listing, sharing, deleting)

## Basic Usage

1. Create a client instance:
   ```typescript
   const client = new HedraClient('your-api-key');
   ```

2. Upload audio and image:
   ```typescript
   const audioUpload = await client.uploadAudio(audioFile);
   const imageUpload = await client.uploadImage(imageFile, '16:9');
   ```

3. Generate a character video:
   ```typescript
   const generation = await client.generateCharacter({
     aspectRatio: '16:9',
     audioSource: 'audio',
     voiceUrl: audioUpload.url,
     avatarImage: imageUpload.url,
   });
   ```

4. Wait for completion and download:
   ```typescript
   const project = await client.waitForProjectCompletion(generation.jobId);
   await client.downloadVideo(project.videoUrl, 'output.mp4');
   ```

## Advanced Usage

For detailed API reference, type information, and advanced usage examples, please refer to the [full documentation](https://www.hedra.com/docs).

## Error Handling

The package includes utilities for handling API errors:

```typescript
import { handleApiError } from 'hedra/dist/utils/api';

try {
  // API calls
} catch (error) {
  handleApiError(error);
}
```

## Contributions

As an unofficial client, contributions, issues, and feature requests are welcome. Please feel free to submit pull requests or open issues on the GitHub repository.

## License

MIT

---

**Note:** This client is based on the public Hedra API documentation. For the most up-to-date and official information about the Hedra API, please refer to the [official Hedra API documentation](https://www.hedra.com/docs).