function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const availability = document.getElementById('availabilityFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const url = new URL(window.location.href);

    if (category === 'all') {
        url.searchParams.delete('category');  
    } else if (category) {
        url.searchParams.set('category', category);  
    }

    if (availability === 'all') {
        url.searchParams.delete('availability');  
    } else if (availability) {
        url.searchParams.set('availability', availability);  
    }

    if (sort) {
        url.searchParams.set('sort', sort);  
    } else {
        url.searchParams.delete('sort');  
    }

    window.location.href = url.href;  
}

function resetFilters() {
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('availability');
    url.searchParams.delete('sort');  
    window.location.href = url.pathname;  
}