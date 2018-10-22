var express = require('express');
const  fs      = require('fs');
const  csv = require('csv-parser');
var router = express.Router();
var sess;
const parcellesController = require('../controllers').parcelles; // controleur des parcelles
const communesController = require('../controllers').communes; //controleur des communes
const lbl_AireController = require('../controllers').lbl_Aires; //controleur des libelles aire
const zonesController = require('../controllers').Zones; //controlleur pour les zones
const userController = require('../controllers').Users; //controlleur pour les utilisateurs
const lienSiqoController = require('../controllers').LienSiqos; // controleur pour le lien siqo
const requestController = require('../controllers').Requests; //controleur pour les requetes des utilisaters



// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4


var sessionchecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index');
  } else {
    next();
  }
};

var checklogin = (req,res, next)=>{
  if(!req.session.user && !req.cookies.user_id){
   
     res.redirect('/login');
  }else{
    next();
  }
};


/* GET home page. */
router.get('/', sessionchecker, function (req, res) {

  res.redirect('/login');
});


router.route('/login/:login?')
  .get(sessionchecker, (req, res) => {

    res.render('login', { log: req.params.login });
  })
  .post(userController.login);




router.route('/search')
  .post(checklogin,lbl_AireController.findLibelle);

router.route('/zone/aire_geo/:id_aire')
  .get(checklogin,zonesController.getAire);

router.route('/aire_geo/:id_aire')
  .get(checklogin,zonesController.findAireGeo);

router.route('/zone/aire_parcellaire/:id_aire')
  .get(checklogin,zonesController.getParcellaire);

router.route('/login/create/user')
  .post(userController.createUser);



router.get('/getExtendParcellaire/:id_aire',checklogin, zonesController.getExtend);

router.route('/communes')
  .post(checklogin,communesController.fetchCommunes);

router.route('/communes/:insee')
  .get(checklogin,communesController.getCommune);

router.route('/parcelles')
  .post(checklogin,parcellesController.fetchParcelles);

router.route('/parcelles/:id')
  .get(checklogin,parcellesController.getParcelle);


router.route('/listAppel/:x/:y')
  .get(zonesController.listAppellationOncoord);


router.route('/siqo/lien/:id_aire')
.get(checklogin,lienSiqoController.getLien);


router.get('/csv',(req,res)=>{
 const results = [];

 fs.createReadStream('test.csv')
 .pipe(csv({separator:','}))
 .on('data',results.push)
 .on('end',()=>{
  console.log(results);
  res.status(200).send(results);
 });
});
module.exports = router;
