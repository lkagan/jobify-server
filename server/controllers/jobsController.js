const index = (req, res) => {
    res.send('index');
}

const create = (req, res) => {
    res.send('create');
}

const destroy = (req, res) => {
    res.send('destroy');
}

const update = (req, res) => {
    res.send('update');
}

const stats = (req, res) => {
    res.send('stats');
}

export { index, create, destroy, update, stats };