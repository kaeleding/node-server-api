const _ = require('lodash');
const express = require('express');
const router = express.Router();
const auth = require('../_aux/auth');
const { db } = require('../config/db');
const { User } = require('../models/user');
const { Project } = require('../models/project');
const { Revision } = require('../models/revision');
const { Client } = require('../models/client');
const { Design } = require('../models/design');
const { PRF } = require('../models/prf');
const { PRFStatus } = require('../models/prfstatus');
const { Supplier } = require('../models/supplier');
const { Material } = require('../models/material');
const { MaterialSupplier } = require('../models/materialsupplier');
const { POSupplier } = require('../models/posupplier');
const { POSupplierStatus } = require('../models/posupplierstatus');
const { Cheque } = require('../models/cheque');
const { ChequeStatus } = require('../models/chequestatus');
const { Contact } = require('../models/contact');
const { Department } = require('../models/department');
const { DesignStatus } = require('../models/designstatus');
const { MaterialStock } = require('../models/materialstock');
const { ProjectStatus } = require('../models/projectstatus');
const { RefStatusCheque } = require('../models/ref_statuscheque');
const { RefStatusDesign } = require('../models/ref_statusdesign');
const { RefStatusPOS } = require('../models/ref_statusPOS');
const { RefStatusProject } = require('../models/ref_statusproject');
const { RefStatusPRF } = require('../models/ref_statusprf');
const { Terms } = require('../models/terms');
const { ProjectContact } = require('../models/projectcontact');


/* GET api listing. */


router.get('/', (req, res) => {
    res.send('yeah baby');
});

//USER Functions
router.get('/users', (req, res) => {

    User.getAll()
        .then(users => {
            res.send(users);
        });

});

router.post('/createuser', (req, res) => {
    var newUser = new User({
        insertedBy: req.body.insertedBy,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
    })

    newUser.save(function (err) {
        if (err) throw err;

        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) throw err;

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) throw err;

                res.send(isMatch);
            })
        })
    })
});

router.post('/loginuser', (req, res) => {
    User.login(req.body).then(user => {
        auth.checkPassword(req.body.password, user.password, (isMatch) => {
            if (isMatch === true) {
                var data = {
                    id: user._id,
                    token: user.tokens[0],
                    authentication: isMatch,
                    message: "User has been authorized!"
                }
                res.send(data);
            } else if (isMatch === false) {
                var data = {
                    authentication: isMatch,
                    message: "Incorrect email/password"
                }
                res.send(data);
            }
        })
    })
});

router.post('/userisme', (req,res) => {

    User.findById(req.body.id, (err,user)=>{
        if(err) throw err;
        if(user.tokens[0].token == req.body.token){
            res.send(user);
        }else{
            res.send(null);
        }
        
    })
})


//End of USER Functions


//PROJECT Functions
// Get all user instances
router.get('/projects', (req, res) => {
    Project.getAll()
        .then(projects => {
            res.send(projects);
        });
});
// Create a new project instance
router.post('/createproject', (req, res) => {

    var body = req.body;
    project = new Project(body);

    project.save();
    res.send('Project Created');
});

// ************ Revision ********** //
router.get('/revisions', (req, res) => {
    Revision.getAll()
        .then(revision => {
            res.send(revision);
        })
});

router.post('/createrevision', (req, res) => {

    revision = new Revision(req.body);
    revision.save();
})
//********************************* //

// ************ Client ************ //
router.get('/clients', (req, res) => {
    Client.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createclient', (req, res) => {
    client = new Client(req.body);
    client.save();
    res.send("Client Created");
})
//********************************* //

// ************ ProjectStatus ************ //
router.get('/projectstatus', (req, res) => {
    ProjectStatus.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createprojectstatus', (req, res) => {
    data = new ProjectStatus(req.body);
    data.save();
    res.send("Project Status Created");
})
//**************************************** //

// ************ Status Project PRF ************ //
router.get('/refstatusprf', (req, res) => {
    RefStatusPRF.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createrefstatusprf', (req, res) => {
    data = new RefStatusPRF(req.body);
    data.save();
    res.send("PRF Status Created");
})
//**************************************** //

// ************ Status Project PRF ************ //

router.post('/createprfstatus', (req, res) => {
    data = new PRFStatus(req.body);
    data.save();
    res.send("Status of PRF Created");
})
//**************************************** //

// ************ Department ************ //
router.get('/departments', (req, res) => {
    Department.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createdepartment', (req, res) => {
    data = new Department(req.body);
    data.save();
    res.send("Department Created");
})
//**************************************** //

// ************ Client ************ //
router.get('/contacts', (req, res) => {
    Contact.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createcontact', (req, res) => {
    contact = new Contact(req.body);
    contact.save();
    res.send("Contact Created");
})
//********************************* //

// ************ References ************ //
router.get('/refstatusproject', (req, res) => {
    RefStatusProject.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createrefstatusproject', (req, res) => {
    ref = new RefStatusProject(req.body);
    ref.save();
    res.send("Reference Status for Project Created");
})
//************************************* //

// ************ ProjectContact ************ //
router.get('/projectcontacts', (req, res) => {
    ProjectContact.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createprojectcontact', (req, res) => {
    data = new ProjectContact(req.body);
    data.save();
    res.send("Project Contact Created");
})
//**************************************** //

// ************ Design ************ //
router.get('/designs', (req, res) => {
    Design.getAll().then(
        data => {
            res.send(data);
        }
    )
})

router.post('/createdesign', (req, res) => {
    design = new Design(req.body);
    design.save();
    res.send("Design Created");
})
//********************************* //

//-------------- PRF ---------------//

//Get all PRF
router.get('/prfs', (req, res) => {
    PRF.getAll().then(
        data => {
            res.send(data);
        }
    )
})

// Create a new prf instance
router.post('/createprf', (req, res) => {

    var body = req.body;
    prf = new PRF(body);

    prf.save();
    res.send('PRF Created');
});


//-------------- Material ---------------//

//Get all Material
router.get('/materials', (req, res) => {
    Material.getAll().then(
        data => {
            res.send(data);
        }
    )
})

// Create a new material instance
router.post('/creatematerial', (req, res) => {

    var body = req.body;
    material = new Material(body);

    material.save();
    res.send('Material Created');
});


//-------------- MaterialSupplier ---------------//

//Get all material suppliers
router.get('/materialsuppliers', (req, res) => {
    MaterialSupplier.getAll().then(
        data => {
            res.send(data);
        }
    )
})

// Create a new material supplier instance
router.post('/creatematerialsupplier', (req, res) => {

    var body = req.body;
    materialsupplier = new MaterialSupplier(body);

    materialsupplier.save();
    res.send('Material Supplier Created');
});

//-------------- POSupplier ---------------//

//Get all po supplier
router.get('/posuppliers', (req, res) => {
    POSupplier.getAll().then(
        data => {
            res.send(data);
        }
    )
})

// Create a new po supplier instance
router.post('/createposupplier', (req, res) => {

    var body = req.body;
    posupplier = new POSupplier(body);

    posupplier.save();
    res.send('PO Supplier Created');
});

//-------------- Supplier ---------------//

//Get all supplier
router.get('/suppliers', (req, res) => {
    Supplier.getAll().then(
        data => {
            res.send(data);
        }
    )
})

// Create a new supplier instance
router.post('/createsupplier', (req, res) => {

    var body = req.body;
    supplier = new Supplier(body);

    supplier.save();
    res.send('Supplier Created');
});

//-------------- POSupplierStatus ---------------//

// Create a new po supplier instance
router.post('/createposupplierstatus', (req, res) => {

    var body = req.body;
    posupplierstatus = new POSupplierStatus(body);

    posupplierstatus.save();
    res.send('PO Supplier Status Created');
});











module.exports = router; 