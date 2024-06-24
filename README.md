# Draggables

<img width="684" alt="Screenshot 2024-06-24 at 6 15 10 PM" src="https://github.com/panges2/draggables/assets/96081835/bbf82170-636c-4c47-9d9d-d0e9ad169e34">

This project provides a simple and intuitive interface for creating draggable elements within a web page. Users can create new draggable elements by double-clicking anywhere on the page, and these elements can be nested within each other, allowing for a flexible and dynamic layout.

## Features

- **Create Draggable Elements**: Double-click anywhere on the page to create a new draggable element.
- **Edit Text**: Double-click on the text within a draggable element to edit it. The input box will seamlessly match the width of the draggable element.
- **Drag and Drop**: Click and hold on a draggable element to move it around the page. Release the mouse to drop it.
- **Nest Elements**: Draggable elements can be nested within each other, allowing for complex layouts.
- **Auto-adjust Sizes**: Parent and ancestor elements adjust their sizes automatically when new elements are added or text is edited.

## Usage
```
open index.html
```
### Creating Draggable Elements

Double-click anywhere on the page to create a new draggable element at the mouse position. Each element is labeled with a unique identifier.

### Editing Text

1. Double-click on the text within a draggable element to start editing.
2. An input box will appear, allowing you to modify the text.
3. Press `Enter` or click outside the input box to finish editing and update the text.

### Dragging Elements

1. Click and hold on a draggable element to start dragging.
2. Move the element to the desired position.
3. Release the mouse button to drop the element.

### Nesting Elements

1. Drag a draggable element over another draggable element with a `.nest-area` class.
2. The dragged element will be nested within the target element.
