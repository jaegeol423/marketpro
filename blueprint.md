# Blueprint: Interactive 3D Stretching Guide

## Overview

This application provides a visually engaging and interactive guide to body stretches. It uses video textures on 3D planes with a chromakey shader to display various stretching motions with transparent backgrounds. Users can select a body part to filter and view the corresponding animated stretching exercises, creating a dynamic and intuitive user experience.

## Current State & Implemented Features

*   **Framework/Libraries:**
    *   HTML, CSS, JavaScript (ES Modules)
    *   Three.js for 3D rendering
*   **Design & Style:**
    *   **Dark Theme:** A deep, dark background to make the video views and UI elements pop.
    *   **Futuristic Aesthetic:** Clean, modern interface with glowing UI elements.
    *   **Color Palette:** Primary colors are shades of glowing blue, cyan, and yellow against a dark backdrop.
    *   **Typography:** Clean, modern sans-serif font (Pretendard).
*   **Core Features:**
    *   **Video-based 3D Views:** Each stretching exercise is presented as a video texture on a 3D plane.
    *   **Chromakey Shader:** A custom GLSL shader is used to remove the green screen background from the videos in real-time, making them appear transparent.
    *   **Body Part Filtering:** UI buttons allow users to filter stretches by body part (e.g., '목', '어깨', '허리').
    *   **Dynamic Layout:** The video views are dynamically arranged in a grid in the 3D space.
    *   **Interactive Controls:** Users can navigate the 3D scene using zoom and pan controls.

## Current Action Plan: Transition to Video-Based Views

1.  **Refactor Project Structure:**
    *   Update `blueprint.md` with the new video-centric plan.
    *   Modify `index.html` to remove the GLTF model canvas and add a container for filter buttons.
    *   Update `style.css` to style the new filter buttons and remove old, unused styles.
2.  **Implement Video Views in `main.js`:**
    *   Remove all `GLTFLoader` and wireframe model-related code.
    *   Define the chromakey `vertexShader` and `fragmentShader`.
    *   Create a data structure for stretches, including `title`, `bodyPart`, and `videoSrc` for each.
    *   Implement a function that creates a `THREE.Mesh` (a plane) for a given stretch:
        *   Creates an HTML `<video>` element programmatically.
        *   Creates a `THREE.VideoTexture` from the video.
        *   Creates a `THREE.ShaderMaterial` using the chromakey shader and the video texture.
        *   Creates the `THREE.Mesh` and adds it to a group.
3.  **Implement Filtering and Layout:**
    *   Create filter buttons in the UI.
    *   Add event listeners to the buttons to filter the video views based on the selected `bodyPart`.
    *   Write a function to arrange the currently visible video views in a grid pattern within the 3D scene.
4.  **Final Touches:**
    *   Ensure videos play automatically and loop.
    *   Set up camera controls (`OrbitControls`) to allow users to zoom and inspect the video views.
    *   Perform error checking and ensure a smooth user experience.
