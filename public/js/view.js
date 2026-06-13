import { formatDate } from "./util.js";
const API_URL = "api/v1/proposals";

// get ID from url
const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProposal() {
  try {
    // call api
    const response = await fetch(`${API_URL}/${id}`);
    const json = await response.json();

    if (!json.success) {
      showErrors(json.error);
      return;
    }

    const proposal = json.data;
    renderProposal(proposal);
  } catch (err) {
    document.getElementById("errorBox").innerHTML =
      "Something went wrong. Please try again";
  }
}

function renderProposal(proposal) {
  const container = document.getElementById("proposalDetails");

  const claimSection = proposal.claim_history
    ? `
    <p><strong>Claim Amount:</strong> ${proposal.claim_amount}</p>
    `
    : "";

  const policySection = proposal.currently_insured
    ? `
    <p><strong> Insurance Company : </strong> ${proposal.insurance_company}</p>
    <p><strong> Policy Number : </strong> ${proposal.policy_number}</p>
    <p><strong>Policy Start Date:</strong> ${formatDate(proposal.policy_start_date)}</p>
    <p><strong>Policy Expiry Date:</strong> ${formatDate(proposal.policy_expiry_date)}</p>
    <p><strong> Sum Insured : </strong> ${proposal.sum_insured}</p>
    <p><strong>Claim History:</strong> ${proposal.claim_history ? "Yes" : "No"}</p>
    ${claimSection}
    `
    : ``;

  container.innerHTML = `
        <h2>Proposal #${proposal.id}</h2>

        <h3>Personal Details</h3>

        <p><strong> Name : </strong> ${proposal.full_name}</p>
        <p><strong> Mobile Number : </strong> ${proposal.mobile_number}</p>
        <p><strong> Email : </strong> ${proposal.email}</p>
        <p><strong> Date of Birth : </strong> ${formatDate(proposal.dob)}</p>
        <p><strong> Gender : </strong> ${proposal.gender}</p>
        <p><strong> City : </strong> ${proposal.city}</p>
        <p><strong> Address:</strong> ${proposal.address}</p>
        <p><strong> Occupation : </strong> ${proposal.occupation}</p>

        <h3> Previous Insurance Details</h3>

        <p><strong> Currently Insured :  </strong> ${proposal.currently_insured === 1 ? 'Yes' : 'No'}   </p>
        ${policySection}
        
        <h3> Members </h3>
        ${renderMembers(proposal.members)}
    `;
}

function renderMembers(members) {

    if(!members || members.length ===0 ) return `<p> None </p>`;
    
    const rows = members.map( (member) => (
        `<tr>
            <td>${member.member_name}</td>
            <td>${member.relationship}</td>
            <td>${formatDate(member.dob)}</td>
            <td>${member.gender}</td>
        </tr>
        `
        ) ).join('');

    return `
    
    <table border = "1">
        <thead>
            <tr>
                <th>Name</th>
                <th>Relationship</th>
                <th>Date of Birth</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>

    `;
}

async function deleteProposal(){

    if(!confirm('Are you sure you want to delete this proposal?') ) return;

    try {

        const  response = await fetch(`${API_URL}/${id}`, {
            method : 'DELETE'
        });
        const json = await response.json();

        if(!json.success) {
            showErrors(json.error);
            return;
        }

        //redirect back to list on successful deletion
        window.location.href = 'index.html';

    } catch(err) {
        document.getElementById('errorBox').innerHTML = 'Something went wrong. Please try again';
    }

}

function goToEdit() {
    window.location.href = `edit.html?id=${id}`
}

function showErrors(errors) {
  const errorBox = document.getElementById("errorBox");

  if (!errors || errors.length === 0) {
    errorBox.innerHTML = "Something went wrong";
    return;
  }

  //build a list of error messages
  const errorList = errors.map((e) => `<li>${e.msg}</li>`).join("");
  errorBox.innerHTML = `<ul>${errorList}</ul>`;

  // scroll to top so user sees the errors
  window.scrollTo(0, 0);
}

loadProposal();

document.getElementById('editBtn').addEventListener('click', goToEdit);
document.getElementById('deleteBtn').addEventListener('click', deleteProposal);