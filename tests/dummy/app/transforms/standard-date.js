import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';

const { Transform } = DS;

/**
 * This transformer is responsive to serialize/deserialize from a date string to a date and vice versa
 */
export default Transform.extend({
	/**
	 * Serialize the date.
	 * @param serialized
	 * @returns {object}
	 */
	deserialize(serialized) {
		return isEmpty(serialized) ? null : moment(serialized, 'YYYY-MM-DD').toDate();
	},
	/**
	 * Deserialized the date.
	 * @param deserialized
	 * @returns {object}
	 */
	serialize(deserialized) {
		return isEmpty(deserialized) ? null : moment(deserialized).format('YYYY-MM-DD');
	}
});
