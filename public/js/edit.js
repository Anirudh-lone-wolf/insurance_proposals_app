import { formatDate } from './util.js';

const API_URL = "api/v1/proposals";

const params = new URLSearchParams(window.location.search);

const id = params.get('id');

async function loadProposal() {

    try {

        const response = await fetch(`${API_URL}/${id}`);
        const json = await response.json();

        if(!json.success) {
            showErrors(json.error);
            return;
        }

        fillForm(json.data);

    } catch(err) {
        document.getElementById("errorBox").innerHTML = "Something went wrong. Please try again";
    }

} 

function fillForm(proposal) {
    document.getElementById("full_name").value = proposal.full_name || "";
    document.getElementById("email").value = proposal.email || "";
    document.getElementById("mobile_number").value = proposal.mobile_number || "";
    document.getElementById("dob").value = proposal.dob ? proposal.dob.substring(0, 10) : "";
    document.getElementById("gender").value = proposal.gender || "";
    document.getElementById("city").value = proposal.city || "";
    document.getElementById("occupation").value = proposal.occupation || "";
    document.getElementById("address").value = proposal.address || "";

    document.getElementById("currently_insured").value = proposal.currently_insured ? "1" : "0";
    document.getElementById("insurance_company").value = proposal.insurance_company || "";
    document.getElementById("policy_number").value = proposal.policy_number || "";
    document.getElementById("policy_start_date").value = proposal.policy_start_date ? proposal.policy_start_date.substring(0, 10) : "";
    document.getElementById("policy_expiry_date").value = proposal.policy_expiry_date ? proposal.policy_expiry_date.substring(0, 10) : "";
    document.getElementById("sum_insured").value = proposal.sum_insured;
    document.getElementById("claim_history").value = proposal.claim_history ? "1" : "0";
    document.getElementById("claim_amount").value = proposal.claim_amount || "";
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