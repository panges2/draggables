const lifeCanvas = document.body;
let draggableCounter = 1;

lifeCanvas.addEventListener('dblclick', (event) => {
  createDraggable(event.clientX, event.clientY, 'new draggable');
});

lifeCanvas.setAttribute('data-draggable-counter', 0);

let isDragging = false;

function createDraggable(x, y, text) {
  const newDraggable = document.createElement("div");
  const newDraggableText = document.createElement("span");
  newDraggableText.textContent = text;

  const nestArea = document.createElement("div");
  nestArea.className = 'nest-area';

  newDraggable.style.position = 'absolute';
  newDraggable.style.paddingBottom = '0';
  newDraggable.style.paddingLeft = '0';
  newDraggable.style.paddingRight = '0';
  newDraggable.className = 'draggable';
  newDraggable.setAttribute('data-draggable-counter', draggableCounter);
  draggableCounter++;

  newDraggableText.className = 'draggableText';

  newDraggable.appendChild(newDraggableText);
  newDraggable.appendChild(nestArea);
  lifeCanvas.appendChild(newDraggable);

  newDraggableText.style.padding = '10px';

  newDraggable.style.left = `${x - newDraggable.offsetWidth / 2}px`;
  newDraggable.style.top = `${y - newDraggable.offsetHeight / 2}px`;

  console.log("draggable number " + newDraggable.getAttribute('data-draggable-counter') + " created");

  newDraggableText.addEventListener('dblclick', (e) => {
    if (!isDragging) {
      e.stopPropagation();

      console.log("text edit");

      const input = document.createElement("input");
      input.type = "text";
      input.value = newDraggableText.textContent;

      // Apply seamless styles to the input element
      input.style.border = 'none';
      input.style.background = 'none';
      input.style.fontSize = 'inherit';
      input.style.fontFamily = 'inherit';
      input.style.color = 'inherit';
      input.style.padding = '0';
      input.style.margin = '0';
      input.style.boxSizing = 'border-box';
      input.style.width = `${newDraggable.offsetWidth}px`; // Set input width to match draggable width

      newDraggable.replaceChild(input, newDraggableText);

      input.addEventListener('blur', () => {
        newDraggableText.textContent = input.value;
        input.parentNode.replaceChild(newDraggableText, input);
        adjustAncestorSizes(newDraggable.parentElement); // Adjust ancestor sizes after editing
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });

      input.focus();
    }
  });

  newDraggable.addEventListener('mousedown', (e) => {
    isDragging = false;
    const dragTimeout = setTimeout(() => {
      isDragging = true;
      startDrag(e, newDraggable);
    }, 200);

    newDraggable.addEventListener('mouseup', () => clearTimeout(dragTimeout), { once: true });
  });

  nestArea.addEventListener('mousedown', (e) => e.stopPropagation());
}

function startDrag(event, target) {
  event.stopPropagation();
  if (!target) return;

  console.log("drag box");

  const initialX = event.clientX - target.getBoundingClientRect().left;
  const initialY = event.clientY - target.getBoundingClientRect().top;

  let originalParent = target.parentElement;

  lifeCanvas.appendChild(target);

  target.style.left = `${event.clientX - initialX}px`;
  target.style.top = `${event.clientY - initialY}px`;

  const moveDiv = (moveEvent) => {
    target.style.left = `${moveEvent.clientX - initialX}px`;
    target.style.top = `${moveEvent.clientY - initialY}px`;
  };

  const stopMoveDiv = (moveEvent) => {
    document.removeEventListener('mousemove', moveDiv);
    document.removeEventListener('mouseup', stopMoveDiv);

    const mouseX = moveEvent.clientX;
    const mouseY = moveEvent.clientY;

    let newParent = null;
    const nestAreas = document.querySelectorAll('.nest-area');
    nestAreas.forEach(nestArea => {
      const nestRect = nestArea.getBoundingClientRect();

      if (
        mouseX >= nestRect.left &&
        mouseY >= nestRect.top &&
        mouseX <= nestRect.right &&
        mouseY <= nestRect.bottom &&
        nestArea !== target.parentElement &&
        nestArea.parentElement !== target
      ) {
        newParent = nestArea;
      }
    });

    if (newParent && newParent.className === 'nest-area') {
      newParent.appendChild(target);
      target.style.position = 'relative';
      target.style.left = '0px';
      target.style.top = '0px';

      adjustNestAreaLayout(newParent);
      adjustAncestorSizes(newParent);
    } else {
      target.style.position = 'absolute';
      target.style.left = `${mouseX - initialX}px`;
      target.style.top = `${mouseY - initialY}px`;
    }

    if (originalParent.className === 'nest-area') {
      adjustNestAreaLayout(originalParent);
      adjustAncestorSizes(originalParent);
    }
  };

  document.addEventListener('mousemove', moveDiv);
  document.addEventListener('mouseup', stopMoveDiv);
}

function adjustAncestorSizes(element) {
  let parent = element;
  while (parent && parent.className === 'nest-area') {
    adjustNestAreaLayout(parent);
    parent = parent.parentElement.parentElement;
  }
}

function adjustNestAreaLayout(nestArea) {
  const children = Array.from(nestArea.children).filter(child => child.className === 'draggable');
  const maxChildrenPerRow = 3;

  let currentRow = 0;
  let currentColumn = 0;
  let maxRowLength = 0;
  let currentRowLength = 0;
  let maxColumnHeight = 0;
  let currentColumnHeight = 0;

  children.forEach((child, index) => {
    if (index % maxChildrenPerRow === 0) {
      currentRow++;
      currentColumn = 0;
      currentRowLength = 10;
      maxColumnHeight += (currentColumnHeight + 10);
      currentColumnHeight = 0;
    }
    child.style.position = 'absolute';
    child.style.left = `${currentRowLength}px`;
    currentRowLength += (child.offsetWidth + 10);
    maxRowLength = currentRowLength > maxRowLength ? currentRowLength : maxRowLength;
    child.style.top = `${maxColumnHeight}px`;
    currentColumnHeight = currentColumnHeight > child.offsetHeight ? currentColumnHeight : child.offsetHeight;
    currentColumn++;
  });

  nestArea.style.width = `${maxRowLength}px`;
  nestArea.style.height = `${maxColumnHeight + currentColumnHeight + 10}px`;
}

const style = document.createElement('style');
style.textContent = `
  .draggable {
    padding: 10px;
    border: 1px solid black;
    background-color: transparent;
    display: inline-block;
    cursor: move;
  }
  .nest-area {
    margin-top: 5px;
    padding-top: 0px;
    padding-right: 0px;
    border-top: 1px solid black;
    padding-bottom: 0px;
    background-color: transparent;
    min-height: 50px;
    min-width: 130px;
    position: relative;
  }
`;
document.head.append(style);
