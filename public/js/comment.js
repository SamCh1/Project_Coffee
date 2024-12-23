const ratingForm = document.getElementById('ratingForm');
const ratingsList = document.getElementById('ratingsList');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('rating');
let selectedRating = 0;

// Handle star rating click
starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-star')) {
    selectedRating = e.target.getAttribute('data-value');
    document.getElementById('rating').value = selectedRating;
    updateStarRating(selectedRating);
    }
});

// Update stars based on selected rating
function updateStarRating(rating) {
    const stars = starRating.querySelectorAll('.fa-star');
    stars.forEach(star => {
    star.classList.toggle('checked', star.getAttribute('data-value') <= rating);
    });
    ratingInput.value = rating;
}

function updateCharacterCount() {
    const comment = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    charCount.textContent = `${comment.value.length}/200 ký tự`;
}