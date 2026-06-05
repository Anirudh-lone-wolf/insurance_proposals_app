import { pool } from "../config/database.js";

export const createProposalService = async (proposalData) => {
  const {
    full_name,
    mobile_number,
    email,
    dob,
    gender,
    city,
    occupation,
    currently_insured,
    insurance_company,
    policy_number,
    policy_start_date,
    policy_expiry_date,
    sum_insured,
    claim_history,
    claim_amount,
    address,
    members,
  } = proposalData;

  // get database connection
  const connection = await pool.getConnection();

  // begin transaction
  await connection.beginTransaction();

  try {
    // STEP 1 : Insert Proposal
    const insertProposalQuery = `
            INSERT INTO proposals (
                full_name, mobile_number, email, dob, gender, city, occupation, 
                currently_insured, insurance_company, policy_number,
                policy_start_date, policy_expiry_date, sum_insured, 
                claim_history, claim_amount, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const proposalValues = [
      full_name,
      mobile_number,
      email,
      dob,
      gender,
      city,
      occupation,
      currently_insured || 0,
      insurance_company || null,
      policy_number || null,
      policy_start_date || null,
      policy_expiry_date || null,
      sum_insured || null,
      claim_history || 0,
      claim_amount || null,
      address || null,
    ];

    const [result] = await connection.execute(
      insertProposalQuery,
      proposalValues,
    );
    const proposalId = result.insertId;

    // Step 2 : insert members if any were provided
    if (members && members.length > 0) {
      const insertMemberQuery = `
            INSERT INTO proposal_members (
                proposal_id, member_name, relationship, dob, gender
            ) VALUES (?,?,?,?,?)
        `;

      for (const member of members) {
        const memberValues = [
          proposalId,
          member.member_name,
          member.relationship || null,
          member.dob || null,
          member.gender || null,
        ];

        await connection.execute(insertMemberQuery, memberValues);
      }
    }

    // commit transaction
    await connection.commit();
    return { proposalId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const listProposalsService = async (query) => {
  // get search term from url
  const { search, page = 1, limit = 10 } = query;

  // force them to be numbers
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;


  // list query
  let selectQuery = `
        SELECT p.id, p.full_name, p.mobile_number, p.city, COUNT(m.id) AS number_of_members, 
        DATE_FORMAT(p.created_at, '%d %b %Y, %h %i %p') AS created_date
        FROM proposals p 
        LEFT JOIN proposal_members m on p.id = m.proposal_id
    `;

  const values = [];

  // only add WHERE clause if user typed something in search
  if (search) {
    selectQuery += ` WHERE p.id LIKE ? OR p.full_name LIKE ? OR p.mobile_number LIKE ?`;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // GROUP BY CLAUSE
  selectQuery += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  values.push(limitNum, offset);

  const [rows] = await pool.query(selectQuery, values);

  return rows;
};

export const viewProposalService = async (id) => {
  const [proposals] = await pool.execute(
    `SELECT * FROM proposals WHERE id = ?`,
    [id],
  );

  if (proposals.length === 0) return null;

  const [members] = await pool.execute(
    `SELECT * FROM proposal_members WHERE proposal_id = ?`,
    [id],
  );

  return { ...proposals[0], members };
};

export const updateProposalsService = async (id, proposalData) => {
  const {
    full_name,
    mobile_number,
    email,
    dob,
    gender,
    city,
    occupation,
    currently_insured,
    insurance_company,
    policy_number,
    policy_start_date,
    policy_expiry_date,
    sum_insured,
    claim_history,
    claim_amount,
    address,
    members,
  } = proposalData;

  // get database connection
  const connection = await pool.getConnection();
  // begin transaction
  await connection.beginTransaction();

  try {

    // update proposals table
    const updateQuery = `UPDATE 
                            proposals SET
                            full_name=?, mobile_number=?, email=?, dob=?, gender=?, city=?, 
                            occupation=?, currently_insured=?, insurance_company=?, 
                            policy_number=?, policy_start_date=?, policy_expiry_date=?, 
                            sum_insured=?, claim_history=?, claim_amount=?, address=?
                            WHERE id=?`;
    
    const updateProposalValues = [
      full_name,
      mobile_number,
      email,
      dob,
      gender,
      city,
      occupation,
      currently_insured || 0,
      insurance_company || null,
      policy_number || null,
      policy_start_date || null,
      policy_expiry_date || null,
      sum_insured || null,
      claim_history || 0,
      claim_amount || null,
      address || null,
    ];

    const [result] = await connection.execute(updateQuery, [...updateProposalValues, id]);

    // if no proposal found, return null
    if( result.affectedRows === 0 ) return null;

    // delete old members
    await connection.execute(`DELETE FROM proposal_members WHERE proposal_id = ?`, [id]);

    // insert members (existing and new)
    if ( members && members.length > 0 ) {
         const insertMemberQuery = `
            INSERT INTO proposal_members (
                proposal_id, member_name, relationship, dob, gender
            ) VALUES (?,?,?,?,?)
        `;

        for( const member of members ) {
            const memberValues = [
                id,
                member.member_name,
                member.relationship || null,
                member.dob || null,
                member.gender || null,
            ];

            await connection.execute(insertMemberQuery, memberValues);
        }
    }

    // commit transaction
    await connection.commit();

    return { proposalId : id};
    
  } catch(error) {

    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }

};

export const deleteProposalService = async (id) => {

    const [result] = await pool.execute(`DELETE FROM proposals where id=?`, [id]);

    if( result.affectedRows === 0) return null;

    return true;
};
