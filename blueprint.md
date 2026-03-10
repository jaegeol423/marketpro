# Project Blueprint: Body Stretching Guide

## Overview
A comprehensive web guide for body stretching exercises, categorized by body parts. Features a modern, responsive UI with theme support.

## Features
- **Categorized Stretches:** Organized by Neck, Shoulders, Back, Wrists, and Legs.
- **Interactive UI:** Users can filter stretches by body part.
- **Web Components:** Custom `<stretch-card>` component for reusable exercise displays.
- **Theme System:** Dark/Light mode toggle (persistent).
- **Responsive Design:** Works seamlessly on mobile and desktop.

## File Structure
- `index.html`: Main layout with category filters and container for stretches.
- `main.js`: Contains `StretchCard` component, exercise data, filtering logic, and theme toggle.
- `style.css`: Design system, layout grid, and theme-aware styling.

## Implementation Plan
1. **Content Strategy:** Define a set of effective stretches for each body part.
2. **Component Design:** Create a visually appealing card component with title, description, and instructions.
3. **Filtering Logic:** Implement a simple JS filter to show/hide stretches based on selected category.
4. **Visual Polish:** Add smooth transitions and hover effects for a premium feel.
