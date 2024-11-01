const { db } = require("../db/connection");
class ContactsDAO {
    static async getContacts({
        filters,
        page = 0,
        contactsPerPage = 20,
    } = { res }) {
        const pagequery = page;
        let query = { "user_id": filters.user_id }
        let sort = { "lenght": filters.sortOrder == 'ascend' ? 1 : -1 }
        if ("searchText" in filters) {
            query = { $text: { $search: filters['searchText'] }, ...query }
        }
        if ("sortBy" in filters) {
            sort[filters.sortBy] = 1
        }
        let cursor
        try {
            cursor = await db().collection('contacts')
                .find(query)
            const contactsList = await cursor.toArray()
            const totalNumContacts = await db().collection('contacts').countDocuments(query)
            return { contactsList, totalNumContacts, success: true }
        } catch (e) {

            return { success: false }
        }
    }
}

module.exports = ContactsDAO