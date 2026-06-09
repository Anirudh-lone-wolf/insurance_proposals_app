
const API_URL = 'api/v1/proposals';

// keep track of member row
let memberCount = 0;

// hide step 1 fields, show step 2 fields
function goToStepTwo() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
}

// hide step 2 fields, show step 1 fields
function goToStepOne() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
}

// hide and show policy fields based on currently insured or not
function togglePolicyFields(){
    const currentlyInsured = document.getElementById('currently_insured').value
    if (currentlyInsured === "1") {
    document.getElementById('policyFields').style.display = 'block';
  } else {
    document.getElementById('policyFields').style.display = 'none';
  }
}

// hide and show claim amount field based on claim history
function toggleClaimField(){
    const claimHistory = document.getElementById('claim_history').value
    if (claimHistory === "1") {
    document.getElementById('claimField').style.display = 'block';
  } else {
    document.getElementById('claimField').style.display = 'none';
  }
}

// add member during proposal creation
function addMember() {
    // update row number
    memberCount++;

    const container = document.getElementById('membersContainer');

    // create a nee div for this member row
    const div = document.createElement('div');
    div.id = `member_${memberCount}`;

    // put inputs inside div
    div.innerHTML = `
    <hr/>
    <label>Member Name</label>
    <input type="text" id=member_name_${memberCount} placeholder="Enter Member Name" />

    <label>Relationship</label>
    <input type="text" id=member_relationship_${memberCount} placeholder="e.g Wife, Son" />

    <label type>Date of Birth</label>
    <input type="date" id=member_dob_${memberCount}>

    <label>Gender</label>
    <select id="member_gender_${memberCount}">
      <option value="">Select gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <button type="button" onclick="removeMember(${memberCount})">Remove</button>
    `;

    container.appendChild(div);
}

// remove member while creating a proposal
function removeMember(id) {
    const div = document.getElementById(`member_${id}`);
    div.remove();
}

// collect member data to send to api
function collectMembers(){
    const members = [];

    for(let i=1; i<=memberCount; i++) {
        // check if member row still exists
        const nameField = document.getElementById(`member_name_${i}`);
        if(!nameField) continue; //skip removed members

        members.push({
            member_name : nameField.value,
            relationship: document.getElementById(`member_relationship_${i}`).value,
            dob: document.getElementById(`member_dob_${i}`).value,
            gender: document.getElementById(`member_gender_${i}`).value,
        });
    }

    return members;
}

// save the proposal details to the database
async function submitProposal() {
    // read all the field values
    const proposalData = {
        full_name : document.getElementById('full_name').value,
        mobile_number : document.getElementById('mobile_number').value,
        email : document.getElementById('email').value,
        dob : document.getElementById('dob').value,
        gender : document.getElementById('gender').value,
        city : document.getElementById('city').value,
        occupation : document.getElementById('occupation').value,
        currently_insured : document.getElementById('currently_insured').value,
        insurance_company: document.getElementById('insurance_company').value,
        policy_number : document.getElementById('policy_number').value,
        policy_start_date : document.getElementById('policy_start_date').value,
        policy_expiry_date : document.getElementById('policy_expiry_date').value,
        sum_insured : document.getElementById('sum_insured').value,
        claim_history : document.getElementById('claim_history').value,
        claim_amount : document.getElementById('claim_amount').value,
        address: document.getElementById('address').value,
        members : collectMembers()
    }

    // send data to api
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(proposalData)
        });

        const json = await response.json();

        // handle response
        if(json.success){
            // redirect to list page after successful creation
            window.location.href = 'index.html';
        } else {
            // show error from server
            showErrors(json.error);
        }
    } catch(err) {
        document.getElementById('errorBox').innerHTML = 'Something went wrong. Please try again'
    }
}

function showErrors(errors){
    const errorBox = document.getElementById('errorBox');

    if( !errors || errors.length === 0) {
        errorBox.innerHTML = 'Something went wrong';
        return;
    }

    //build a list of error messages
    const errorList = errors.map(e => `<li>${e.msg}</li>`).join('');
    errorBox.innerHTML = `<ul>${errorList}</ul>`;

    // scroll to top so user sees the errors
    window.scrollTo(0, 0);
}
