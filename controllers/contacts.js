
const ContactsDAO = require("../dao/contacts.js")
const Contact = require('../models/Contact.js')
const { db } = require("../db/connection");
const { ObjectId } = require('mongodb');

const getContacts = async (req, res) => {
    const contactsPerPage = req.query.size
    const page = req.query.page ? parseInt(req.query.page) : 0
    const user_id = req.query.user_id
    const sortOrder=req.query.sortOrder ? req.query.sortOrder:"ascend"
    const sortBy=req.query.sortBy
    let filters = {}
    filters.user_id = user_id
    if (req.query.searchText) {
        filters.searchText = req.query.searchText
    }
    if(sortBy){
        filters.sortBy=sortBy
    }
    filters.sortOrder=sortOrder
    const { contactsList, totalNumContacts ,success} = await ContactsDAO.getContacts({
        filters, page,
        contactsPerPage
    })
   // console.log("success,",success)
    if(success){
    let response = {
        contacts: contactsList,
       // page: page,
        //filters: filters,
        //entries_per_page: contactsPerPage,
        //total_results: totalNumContacts,
    }
      return res.status(200).json(response)
    }else{
       return res.status(500).json({success:false,msg:"Quelque chose n'a pas marché sur le serveur"})
    }
}

const addContact = async (req, res) => {
    try {
        const user_id = req.body.user_id
        if(!user_id){
            return res.status(401).json({success:false,msg:"Qui es tu ? Tu essayes de créer un contact sans fournit ton id obligatoire"})
              
        }
        let contact = new Contact(req.body.nom, req.body.prenoms, req.body.email, req.body.tel, req.body.adresse, req.body.date_nais, req.body.notes,user_id)
        let result = await db().collection("contacts").insertOne(contact)
        return res.status(200).json({success:true,msg:"Votre contact a été ajouté avec succès",data:result})
    } catch (error) {
       // console.log(error)
       return res.status(500).json({success:false,msg:"Quelque chose n'a pas marché sur le serveur"})
       
    }
}


const getContact = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id)
        let contact = await db().collection("contacts").findOne({ _id: id })
        if (contact) {
            return res.status(200).json(contact)
        } else {
            return res.status(204).json({success:false, msg: "Ce contact n'existe pas" })
        }

    } catch (error) {
        return res.status(500).json({success:false,msg:"Quelque chose n'a pas marché sur le serveur",error:error})
        
    }
}

const updateContact = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id)
        let user_id = req.body.user_id
        let contact = await db().collection("contacts").findOne({ _id: id })
        if (!contact) {
            return res.status(404).json({ msg: "Contact non trouvé" })
        }
       // console.log(req.body)
        if (contact.user_id == user_id) {
           // console.log(id,user_id)
            let result = await db().collection("contacts").updateOne({ user_id: user_id, _id: id }, { $set: {...req.body,} })
            //console.log(result)
            //if (result.modifiedCount === 0) {
             //   return res.status(304).json({success:false, msg: "Echec de la mis à jour.Il semble que tu n'as changé aucune donnée" })
           // } else {
                return res.status(200).json({success:true, msg: "Modification réussie" })
            //}
        } else {
            return res.status(401).send({success:false, message: "Tu n'es pas le détenteur du contact" })
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false, message: "Quelque chose n'a pas marché au niveau du serveur" })
    }
}

const deleteContact = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id)
        let user_id = req.body.user_id
       // console.log("user_id ",user_id )
        let contact = await db().collection("contacts").findOne({ _id: id })
        if (!contact) {
            return res.status(404).json({ msg: "Contact non trouvé" })
        }
        if (contact.user_id == user_id) {
            let result = await db().collection("contacts").deleteOne({ _id: id })
            if (result.deletedCount == 1) {
                return res.status(200).json({ msg: "Suppression réussie" ,success:true})
            } else {
                return res.status(404).json({ msg: "Contact non trouvé pour supprimer" ,success:false})
            }
        } else {
            return res.status(401).send({ msg: "Tu n'es pas le détenteur du contact",success:false})
        }

    } catch (error) {
       // console.log(error)
        return res.status(500).json(error)
    }
}

module.exports = { getContacts, deleteContact, updateContact, getContact, addContact }