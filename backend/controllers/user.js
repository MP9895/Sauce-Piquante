const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const mongooseError = require('mongoose-error');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(mongooseError => res.status(400).json({ mongooseError }));
      })
      .catch(mongooseError => res.status(500).json({ mongooseError }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET,  // Utilisation de process.env
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(mongooseError => res.status(500).json({ mongooseError }));
        })
        .catch(mongooseError => res.status(500).json({ mongooseError }));
};