const { log } = require('console');
const Sauce = require('../models/sauce');
const fs = require ('fs');
const mongooseError = require('mongoose-error');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,     
    });
    sauce.save()
    .then( () => res.status(201).json({ message: 'Sauce sauvegardée'}))
    .catch( mongooseError => res.status(400).json({ mongooseError }))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
      : { ...req.body };
  
    // Vérifier l'autorisation de modification de la sauce
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Vérifier si l'utilisateur est autorisé à modifier la sauce
        if (sauce.userId !== req.userId)
        {
          return res.status(401).json({ message: 'Non autorisé à modifier cette sauce.' });
        }
  
        if (req.file) {
          const filename = sauce.imageUrl.split('/images/')[1];
          if (fs.existsSync(`images/${filename}`)) {
            fs.unlinkSync(`images/${filename}`);
          }
        }

        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
          .catch(mongooseError => res.status(400).json({ mongooseError }));
      })
      .catch(mongooseError => res.status(400).json({ mongooseError }));
};

exports.deleteSauce = (req, res, next) => {
    // Vérifier l'autorisation de suppression de la sauce
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Vérifier si l'utilisateur est autorisé à supprimer la sauce
        if (sauce.userId !== req.userId) {
          return res.status(401).json({ message: 'Non autorisé à supprimer cette sauce.' });
        }
  
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
            .catch(mongooseError => res.status(400).json({ mongooseError }));
        });
      })
      .catch(mongooseError => res.status(400).json({ mongooseError }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( mongooseError => res.status(400).json({ mongooseError }))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( mongooseError => res.status(404).json({ mongooseError }))
};

exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) {
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce' }))
        .catch( mongooseError => res.status(400).json({ mongooseError }))

    } else if(like === -1) {
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
        .catch( mongooseError => res.status(400).json({ mongooseError }))

    } else {
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch( mongooseError => res.status(400).json({ mongooseError }))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch( mongooseError => res.status(400).json({ mongooseError }))
                }           
        })
        .catch( mongooseError => res.status(400).json({ mongooseError  }))             
    }   
};