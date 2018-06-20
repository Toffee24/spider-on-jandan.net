
const Sequelize = require('sequelize')
const sequelize = new Sequelize('jandan_url', 'jandan_url', 'FaX3ACbH3RcfBjcj', {
    host: '67.216.220.132',
    port: '3306',
    dialect: 'mysql',
    timezone: '+08:00'
})
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const Url = sequelize.define('url', {
    pic_url: {
        unique: true,
        type: Sequelize.STRING,
    },
    xx: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    oo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
    }
})
module.exports = Url
