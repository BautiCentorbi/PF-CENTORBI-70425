function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const url = new URL(window.location.href);

    if (category === 'all') {
        url.searchParams.delete('category');  
    } else if (category) {
        url.searchParams.set('category', category);  
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
    url.searchParams.delete('sort');  
    window.location.href = url.pathname;  
}