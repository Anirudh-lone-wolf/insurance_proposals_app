export const checkDob = (value) => {
    const dob = new Date(value);
     const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference = today.getMonth() - dob.getMonth();
    if(monthDifference < 0 || ( monthDifference === 0 && today.getDate() < dob.getDate() )) {
        age--;
    }

    if(dob > today) throw new Error('Date of birth cannot be a future date');
    if(age < 18) throw new Error("Proposer must be at least 18 years old");
    if(age > 65) throw new Error("Proposer must be under 65 years old");

    return true;
}

export const calculateAge = (dobValue) => {
  const dob = new Date(dobValue);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};