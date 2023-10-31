const {db} = require("../db/connection");
let contacts
 class ContactsDAO {
    static async getContacts({// default filter
        filters,
        page = 0,
        contactsPerPage = 20, // will only get 20 contacts at once
    } = {res}) {
        const pagequery=page;
        let query={"user_id":filters.user_id }
        let sort={"lenght":filters.sortOrder=='ascend' ? 1:-1}
            if ("searchText" in filters) {
                query = { $text: { $search: filters['searchText'] },...query }
            }
            if ("sortBy" in filters) {
                sort[filters.sortBy]=1
            }
        let cursor
        try {
            cursor = await db().collection('contacts')
                .find(query)
                //.sort(sort)
                //.limit(contactsPerPage)
                //.skip(contactsPerPage * pagequery)
            const contactsList = await cursor.toArray()
            const totalNumContacts = await db().collection('contacts').countDocuments(query)
            return { contactsList, totalNumContacts ,success:true}
        }catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            //return { moviesList: [], totalNumMovies: 0 }
             
             return {success:false}
        }
    }
}

module.exports=ContactsDAO