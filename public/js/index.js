const API_URL = 'api/v1/proposals';
const LIMIT = 10;

let currentPage = 1;
let currentSearch = '';

async function loadProposals() {

    // build url with page and search
    let url = `${API_URL}?page=${currentPage}&limit=${LIMIT}`;

    if( currentSearch ) {
        url += `&search=${currentSearch}`;
    }

    // call api
    const response = await fetch(url);
    const json = await response.json();

    // put response into tables
    renderTable(json.data);

    // pagination
    renderPagination(json.data.length);
}

function renderTable (proposals) {

    const tbody = document.getElementById('proposalTableBody');

    // if no proposals, show a message
    if (!proposals || proposals.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No proposals Found</td><tr>`;
        return;
    }

    // loop through proposals and build html table rows
    tbody.innerHTML = proposals.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.full_name}</td>
            <td>${p.mobile_number}</td>
            <td>${p.city}</td>
            <td>${p.number_of_members}</td>
            <td>${p.created_date}</td>
            <td>
                <a href="view.html?id=${p.id}">View</a>
                <a href="edit.html?id=${p.id}">Edit</a>
                <button onclick="deleteProposal(${p.id})">Delete</button>
            </td>
        </tr>
        `).join(``);

}

// search functions

function handleSearch () {
    currentSearch = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    loadProposals();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    currentSearch = '';
    currentPage = 1;
    loadProposals();
}

// delete proposal
async function deleteProposal(id) {
    if( !confirm('Are you sure you want to delete this proposal?') ) return;

    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const json = await response.json();

    if(json.success) {
        loadProposals();
    } else {
        alert('Failed to delete proposal');
    }
}

function renderPagination(count) {
    const pagination = document.getElementById('pagination');
    const hasNext = count === LIMIT;
    const hasPrev = currentPage > 1;

    pagination.innerHTML = `
        <button onclick="changePage(${(currentPage - 1)})" ${ !hasPrev ? `disabled` : ``}>
        Prev
        </button>
        <span>Page ${currentPage}</span>
        <button onclick="changePage(${(currentPage + 1)})" ${ !hasNext ? `disabled` : ``}>
        Next
        </button>
    `;
}

function changePage(page) {
    currentPage = page;
    loadProposals();
}

loadProposals();

// search and clear
document.getElementById('searchBtn').onclick = handleSearch;
document.getElementById('clearBtn').onclick = clearSearch;
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') handleSearch();
})

