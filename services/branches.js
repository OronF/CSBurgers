const Branch = require('../models/branches');

const getAll = async() => {
    return await Branch.find({});
}

const createBranch = async (newBranch) => {
    const branch = new Branch({
        name: newBranch.name,
        address: newBranch.address,
        phoneNumber: newBranch.phoneNumber,
        activityTime: newBranch.activityTime,
        manager: newBranch.manager,
        coordinateX: newBranch.coordinateX,
        coordinateY: newBranch.coordinateY,
        area: newBranch.area
    });

    return await branch.save();
}

const searchBranch = async(id) => {
    return await Branch.findById(id);
}

const deleteBranch = async (id) => {
    const branch = await searchBranch(id);

    if (!branch) {
        return null;
    }

    await branch.deleteOne();

    return branch;
}

const updateBranch = async (newBranch) => {
    const branch = await searchBranch(newBranch.id);

    if (!branch) {
        return null;
    }

    branch.name = newBranch.name;
    branch.address = newBranch.address;
    branch.phoneNumber = newBranch.phoneNumber;
    branch.activityTime = newBranch.activityTime;
    branch.manager = newBranch.manager;
    branch.coordinateX = newBranch.coordinateX;
    branch.coordinateY = newBranch.coordinateY;
    branch.area = newBranch.area;

    await branch.save()
    return branch;
}

const searchByArea = async (area) => {
    return await Branch.find({area});
}

module.exports = {
    getAll,
    create: createBranch,
    delete: deleteBranch,
    update: updateBranch,
    search: searchBranch,
    searchByArea
}