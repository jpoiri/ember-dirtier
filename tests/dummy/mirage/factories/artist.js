import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    name() {
        return faker.name.findName();
    },
    genre() {
        return faker.hacker.noun();
    },
    country() {
        return faker.address.country();
    },
    bio() {
        return faker.lorem.sentence();
    }

});
