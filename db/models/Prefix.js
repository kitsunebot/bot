module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Prefix', {
        prefix: {type:Sequelize.STRING(5), primaryKey:true, unique:true,allowNull:false},
        name: {type: Sequelize.STRING(20), allowNull:true}
    }, {
        underscored: true,
        tableName: 'prefixes',
        name: {
            singular: 'Prefix',
            plural: 'Prefixes'
        }
    })
};