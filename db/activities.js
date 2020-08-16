const client = require('./client.js');


async function getAllActivities() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM activities;
        `);
        return rows;
    } catch (error) {
      throw error;
    }
}


async function getActivityById(id) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM activities
            WHERE id=$1;
        `, [id]);
        if (!rows || rows.length === 0) {
            return null
        }
        const [activities] = rows
        return activities
    } catch (error) {
        throw error
    }
}


async function createActivity(name, description) {
    try {
        await client.query(`
            INSERT INTO activities(name, description)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING;
        `, [name, description]);
        const { rows } = await client.query(`
            SELECT * FROM activities
            WHERE name=$1 AND description=$2
        `, [name, description]);
        return rows[0]
    } catch (error) {
        throw error;
    }
}

async function updateActivity(activityId, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    if (setString.length === 0) {
        return;
    }
    try {
        const { rows: [activities] } = await client.query(`
            UPDATE activities
            SET ${ setString}
            WHERE id=${ activityId }
            RETURNING *;
        `, Object.values(fields));
        return activities;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getAllActivities,
    getActivityById,
    createActivity,
    updateActivity
}