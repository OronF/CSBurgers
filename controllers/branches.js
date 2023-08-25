const branchesService = require('../services/branches');

const getAllBranches = async (req, res) => {
    try {
        const Branches = await branchesService.getAll();

        if(!Branches) {
            throw new Error('Non existing branches');
        }

        res.json(Branches);
    }

    catch (error) {
        res.status(400).json({
            error: "Getting all the branches - Error",
            message: error.message
        });
    }
}

const createBranch = async (req, res) => {
    try {
        const tmp = {
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            activityTime: req.body.activityTime,
            manager: req.body.manager,
            coordinateX: req.body.coordinateX,
            coordinateY: req.body.coordinateY
        }

        const newBranch = await branchesService.create(tmp);

        if (!newBranch) {
            throw new Error("can't create a new branch");
        }

        res.json(newBranch);
    }

    catch (error) {
        res.status(400).json({
            error: "Creating new branch - Error",
            message: error.message
        });
    }
}

const updateBranch = async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({message:'The new name to the branch is required'});
    }

    if (!req.body.address) {
        res.status(400).json({message:'The new address to the branch is required'});
    }

    if (!req.body.phoneNumber) {
        res.status(400).json({message:'The new phoneNumber to the branch is required'});
    }

    if (!req.body.activityTime) {
        res.status(400).json({message:'The new activityTime to the branch is required'});
    }

    if (!req.body.manager) {
        res.status(400).json({message:'The new manger to the branch is required'});
    }
    
    if (!req.body.coordinateX) {
        res.status(400).json({message:'The new coordinateX to the branch is required'});
    }
    
    if (!req.body.coordinateY) {
        res.status(400).json({message:'The new coordinateY to the branch is required'});
    }

    const newBranch = {
        id: req.params.id,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        activityTime: req.body.activityTime,
        manager: req.body.manager,
        coordinateX: req.body.coordinateX,
        coordinateY: req.body.coordinateY
    }

    const branch = await branchesService.update(newBranch);
    if (!branch) {
        return res.status(404).json({errors:['Branch not found']});
    }

    res.json(branch);
};


const deleteBranch = async (req, res) => {
    const branch = await branchesService.delete(req.params.id);
    
    if (!branch) {
        return res.status(404).json({errors:['Branch not found']});
    }

    res.send();
}

const searchBranch = async (req, res) => {
    const branch = await branchesService.search(req.params.id);
    
    if (!branch) {
      return res.status(404).json({errors:['Branch not found']});
    }

    res.json(branch);
}

module.exports = {
    getAllBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    searchBranch
}