const Link = require('../models/link.model.js')

// Create and Save a new Link

exports.create = (req, res) => {
    // Validate request
    if(!req.body.href) {
        return res.status(400).send({
            message: 'Link href can not be empty'
        })
    }
    if(!req.body.title) {
        return res.status(400).send({
            message: 'Link title can not be empty'
        })
    }

    // Create a Link
    const link = new Link({
        title: req.body.title, 
        href: req.body.href,
        tags: req.body.tags.split(',')
    })

    // Save Link in the database
    link.save()
    .then(data => {
        res.redirect('/')
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Link.'
        })
    })
}

// Retrieve and return all links from the database.
exports.findAll = (req, res) => {
    const query = req.query.q;
    const regex = new RegExp(query,'i')

    Link.find().where({
        $or: [{title: regex}, {href: regex}, {tags: regex}]
    })
    .then(links => {
        res.render('home', {links, query})
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving links.'
        })
    })
}

// Find a single Link with a linkId
exports.findOne = (req, res) => {
    Link.findById(req.params.id)
    .then(link => {
        if(!link) {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })            
        }
        res.render('edit', {id: link._id, title: link.title, href: link.href, tags: link.tags.join(', ')})
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })                
        }
        return res.status(500).send({
            message: 'Error retrieving link with id ' + req.params.linkId
        })
    })
}

// Update a link identified by the linkId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.href) {
        return res.status(400).send({
            message: 'Link href can not be empty'
        })
    }
    if(!req.body.title) {
        return res.status(400).send({
            message: 'Link title can not be empty'
        })
    }

    // Find link and update it with the request body
    Link.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        href: req.body.href,
        tags: req.body.tags.split(',')
    }, {new: true})
    .then(link => {
        if(!link) {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })
        }
        res.redirect('/')
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })                
        }
        return res.status(500).send({
            message: 'Error updating link with id ' + req.params.linkId
        })
    })
}

// Delete a link with the specified linkId in the request
exports.delete = (req, res) => {
    Link.findByIdAndRemove(req.params.id)
    .then(link => {
        if(!link) {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })
        }
        res.redirect('/')
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: 'Link not found with id ' + req.params.linkId
            })                
        }
        return res.status(500).send({
            message: 'Could not delete link with id ' + req.params.linkId
        })
    })
}