import _ from 'lodash'
import Element from '.'

export default class Is {
    private _element: Element
    constructor(element: Element){
        this._element = element
    }

    public element = () => this._element
    public flags = () => this.element().flags()
    public rules = () => this.element().rules()
    public allow = () => this.element().allow()
    public type = () => this.element().type()

    public flagExist = () => typeof this.flags() != 'undefined'
    public rulesExist = () => typeof this.rules() != 'undefined'

    string = () => this.type() === 'string'
    number = () => this.type() === 'number'
    date = () => this.type() === 'date'
    boolean = () => this.type() === 'boolean'

    isLocalDefaultValue = () => this.defaultValue() && typeof this.flags().default === 'function'
    isSQLDefaultValue = () => this.defaultValue() && typeof this.flags().default !== 'function'
    defaultValue = () => this.flagExist() && typeof this.flags().default !== 'undefined'
    insensitive = () => this.flagExist() && !!this.flags().insensitive || false
    required = () => this.flagExist() && this.flags().presence === 'required' || false
    unique = () =>  this.flagExist() && this.flags().unique === true || false
    increment = () => this.flagExist() && this.flags().auto_increment === true || false
    primaryKey = () => this.flagExist() && ((this.flags().primary_key === true || false) || this.increment())
    foreignKey = () => this.flagExist() && Array.isArray(this.flags().foreign_key) && this.flags().foreign_key.length >= 2
    populate = () => this.flagExist() && Array.isArray(this.flags().populate) && this.flags().populate.length >= 2
    group = () => this.flagExist() && Array.isArray(this.flags().group)
    noPopulate = () => this.flagExist() && this.flags().noPopulate === true || false
    deleteCascade = () => this.foreignKey() && this.flags().delete_cascade
    updateCascade = () => this.foreignKey() && this.flags().update_cascade
    float = () => this.flagExist() && !!this.flags().float
    double = () => this.flagExist() && this.flags().double === true
    dateFormatSet = () => this.flagExist() && !!this.flags().format
    dateUnix = () => this.dateFormatSet() && this.flags().format === 'unix'
    enum = () => (this.string() || this.number()) && !!this.allow()

    ref = () => !!this.allow() && this.allow().length > 0 && !!Object.assign({}, ...this.allow()).ref
    precisionSet = () => !!_.find(this.rules(), {name: 'precision'})
    maxSet = () => this.rulesExist() && !!_.find(this.rules(), {name: 'max'})
    lessSet = () => this.rulesExist() && !!_.find(this.rules(), {name: 'less'})
    minSet = () => this.rulesExist() && !!_.find(this.rules(), {name: 'min'})
    greaterSet = () => this.rulesExist() && !!_.find(this.rules(), {name: 'greater'})
    portSet = () => this.rulesExist() && !!_.find(this.rules(), {name: 'port'})
    maxSizeSet = () => this.string() ? !(!this.maxSet() && this.element().get().stringLengthByType() == -1) : undefined


    strictlyPositive = () => {
        if (!this.rulesExist()){
            return false
        }
        const isNegative = _.find(this.rules(), {name: 'negative'})
        const isPositive = _.find(this.rules(), {name: 'positive'})
        const isSign = _.find(this.rules(), {name: 'sign'})

        if (isNegative)
            return false
        if (isPositive)
            return true
        if (isSign)
            return isSign.args.sign === 'positive'
        return false
    }
}