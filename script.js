document.addEventListener('DOMContentLoaded', () => {
    const friendCard = document.getElementById('friend-card');
    const jsonUrl = 'https://raw.githubusercontent.com/explysm/friend/main/friend.json';

    // Function to make an element draggable
    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let originalZIndex = elmnt.style.zIndex || 'auto';
        let originalPosition = elmnt.style.position; // Store original position

        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Get the element's current position relative to the viewport
            const rect = elmnt.getBoundingClientRect();
            const initialTop = rect.top;
            const initialLeft = rect.left;

            // Set position to absolute and apply current coordinates to prevent jump
            elmnt.style.position = 'absolute';
            elmnt.style.top = initialTop + 'px';
            elmnt.style.left = initialLeft + 'px';

            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            elmnt.style.zIndex = 1000; // Bring to front
            console.log('Dragging started for:', elmnt);
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Get current computed style for top and left
            const computedStyle = window.getComputedStyle(elmnt);
            let currentTop = parseInt(computedStyle.top) || 0;
            let currentLeft = parseInt(computedStyle.left) || 0;

            // set the element's new position:
            elmnt.style.top = (currentTop - pos2) + "px";
            elmnt.style.left = (currentLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
            elmnt.style.zIndex = originalZIndex; // Restore original z-index
            elmnt.style.position = originalPosition; // Restore original position
            elmnt.style.top = ''; // Remove inline top style to snap back
            elmnt.style.left = ''; // Remove inline left style to snap back
            console.log('Dragging ended for:', elmnt);
        }
    }

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            friendCard.innerHTML = ''; // Clear loading message

            if (data.pfp_image) {
                const pfp = document.createElement('img');
                pfp.src = data.pfp_image;
                pfp.alt = `${data.name}'s profile picture`;
                pfp.classList.add('pfp-image');
                // pfp.style.position = 'absolute'; // Removed: will be set on drag
                friendCard.appendChild(pfp);
                makeDraggable(pfp); // Make PFP draggable
                console.log('PFP created and made draggable.', pfp);
            }

            const name = document.createElement('h2');
            name.classList.add('friend-name');
            name.textContent = data.name || 'Unknown Friend';
            // name.style.position = 'absolute'; // Removed: will be set on drag
            friendCard.appendChild(name);
            makeDraggable(name); // Make name draggable
            console.log('Name created and made draggable.', name);

            const desc = document.createElement('p');
            desc.classList.add('friend-desc');
            desc.textContent = data.desc || 'No description provided.';
            // desc.style.position = 'absolute'; // Removed: will be set on drag
            friendCard.appendChild(desc);
            makeDraggable(desc); // Make description draggable
            console.log('Description created and made draggable.', desc);

            if (data.attached_image) {
                const attachedImg = document.createElement('img');
                attachedImg.src = data.attached_image;
                attachedImg.alt = `Image attached to ${data.name}'s description`;
                attachedImg.classList.add('attached-image');
                // attachedImg.style.position = 'absolute'; // Removed: will be set on drag
                friendCard.appendChild(attachedImg);
                makeDraggable(attachedImg); // Make attached image draggable
                console.log('Attached image created and made draggable.', attachedImg);
            }
        })
        .catch(error => {
            console.error('Error fetching friend data:', error);
            friendCard.innerHTML = '<p style="color: red;">Failed to load friend data. Please try again later.</p>';
        });
});