const	Model = require('../../schemas/model'),
	 	express = require('express'),
	 	middleware = require('../../middleware'),
		router 	= express.Router();

router.get('/', (req, res) => {
		Model.find({}, (err, models) => {
		if(err) {
			console.log('Could not find the models');
		} else {
			res.render("models/index", {models: models})
		}
	})
});

//new model route
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('models/new');
})

//show route
router.get('/:id', (req, res) => {
	const userId = req.params.id;
	Model.findOne({_id: userId}).populate('comments').exec((err, model) => {
		res.render('models/show', {model: model})
	})
});

//post route model
router.post('/', middleware.isLoggedIn, (req, res) => {
	const modelData = req.body.model;
	console.log(modelData);
	const creator = {
		id: req.user._id,
		username: req.user.username
	}
	modelData.creator = creator;
	Model.create(modelData, (err, model) => {
		if(err) {
			console.log(err);
		} else {
			req.flash('success', 'Model Added')
			res.redirect('models');
		}
	})
})

//edit model routes
router.get('/:id/edit', middleware.checkOwnership('model'), (req, res) => {
	const userId = req.params.id;
	Model.findOne({_id: userId}, (err, model) => {
		if(err) {
			res.redirect('/model');
		} else {
			res.render('models/edit', {model: model});
		}
	})
})

router.put('/:id', (req, res) => {
	const userId = req.params.id;
	Model.findByIdAndUpdate(userId, req.body.model, (err, updatedModel) => {
		if(err) {
			console.log(err);
		} else {
			req.flash('success', 'Model edited successfully')
			res.redirect('/models/' + userId);
		}
	})
})

router.delete('/:id', (req, res) => {
	Model.findByIdAndDelete({_id: req.params.id}, (err) => {
		if(err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Model successfully removed');
			res.redirect('/models');
		}
	})
})

module.exports = router;