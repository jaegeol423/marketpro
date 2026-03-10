# Blueprint: Interactive 3D Stretching Guide

## Overview

This application provides a visually engaging and interactive guide to body stretches. Instead of a traditional menu, users interact with a 3D model of a human body. Clicking on different body parts filters and displays relevant stretching exercises, creating an intuitive and futuristic user experience.

## Current State & Implemented Features

*   **Framework/Libraries:**
    *   HTML, CSS, JavaScript (ES Modules)
    *   Three.js for 3D rendering
*   **Design & Style:**
    *   **Dark Theme:** A deep, dark background to make the 3D model and UI elements pop.
    *   **Futuristic Aesthetic:** Inspired by Tron-like visuals, using glowing lines and a wireframe 3D model.
    *   **Color Palette:** Primary colors are shades of glowing blue, cyan, and yellow against a dark backdrop.
    *   **Typography:** Clean, modern sans-serif font (Pretendard).
    *   **Layout:** Centered, responsive layout.
*   **Core Features:**
    *   **Interactive 3D Model:** A central, rotating 3D human model serves as the main navigation.
    *   **Body Part Selection:** The model is divided into clickable zones (head, shoulders, back, arms/wrists, legs). Raycasting is used to detect user clicks on these zones.
    *   **Dynamic Highlighting:** When a body part is hovered over or selected, it glows or changes color to provide clear visual feedback.
    *   **Stretch Display:** A grid or list of "cards," where each card contains information for a specific stretch (title, description, steps).
    *   **Filtering:** Clicking a body part on the 3D model filters the stretch cards to show only relevant exercises. A button to show all stretches is also available.

## Current Action Plan: Initial Implementation

1.  **Project Setup:**
    *   Structure the project with `index.html`, `main.js`, and `style.css`.
    *   Create a `blueprint.md` to document the plan.
2.  **HTML Structure (`index.html`):**
    *   Add a canvas for the Three.js model.
    *   Create a container for the title and subtitle.
    *   Define a main grid area where stretch cards will be dynamically inserted.
    *   Include the Three.js library from a CDN.
3.  **Styling (`style.css`):**
    *   Implement the dark theme and futuristic aesthetic.
    *   Style the header, the main grid, and the card elements for the stretches.
    *   Ensure the layout is responsive and visually appealing.
4.  **3D Model and Logic (`main.js`):**
    *   Set up the Three.js scene, camera, and renderer.
    *   Load a 3D model of a human body (e.g., in `gltf` format).
    *   Apply a wireframe or semi-transparent material with emissive properties to achieve the glowing effect.
    *   Implement rotation animation for the model.
    *   Set up raycasting to detect user clicks on the model.
    *   Define mapping between the 3D model's parts and the stretch categories (e.g., 'neck', 'shoulder').
    *   Write functions to filter and display the stretch cards based on the selected body part.
    *   Populate the initial view with all stretches.
5.  **Refinement:**
    *   Check for errors and ensure all interactions are smooth.
    *   Adjust lighting, materials, and colors for the best visual impact.
