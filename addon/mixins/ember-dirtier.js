import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { observer } from '@ember/object';
import { isEmpty, isNone } from '@ember/utils';
import { A } from '@ember/array';

export default Mixin.create({
	/**
	 * Add observers for attribute keys.
	 *
	 * @private
	 */
	_addObservers() {
		this.eachAttribute(attributeName => {
			this.addObserver(`${attributeName}.[]`, () => {
				if (this._isDirtyAttribute(attributeName)) {
					this._addDirtyAttribute(attributeName);
				} else {
					this._removeDirtyAttribute(attributeName);
				}
			});
		});
		this.eachRelationship((relationshipName, relationshipDescriptor) => {
			if (this._isBelongsToRelationship(relationshipDescriptor)) {
				this.addObserver(`${relationshipName}.dirty`, () => {
					if (this._isBelongsToRelationshipDirty(relationshipName)) {
						this._addDirtyRelationship(relationshipName);
					} else {
						this._removeDirtyRelationship(relationshipName);
					}
				});
			} else if (this._isHasManyRelationship(relationshipDescriptor)) {
				this.addObserver(`${relationshipName}.@each.dirty`, () => {
					if (this._isHasManyRelationshipDirty(relationshipName)) {
						this._addDirtyRelationship(relationshipName);
					} else {
						this._removeDirtyRelationship(relationshipName);
					}
				});
			}
		});
	},

	/**
	 * Add dirty attribute
	 *
	 * @private
	 * @param {string} attributeName
	 */
	_addDirtyAttribute(attributeName) {
		this._setDirtyProperty(attributeName, true);
		this._safePushObject('dirtyAttributes', attributeName);
		this._safePushObject('dirtyProperties', attributeName);
	},

	/**
	 * Remove dirty attribute
	 *
	 * @private
	 * @param {string} attributeName The attributeName
	 */
	_removeDirtyAttribute(attributeName) {
		this._setDirtyProperty(attributeName, false);
		this._safeRemoveObject('dirtyAttributes', attributeName);
		this._safeRemoveObject('dirtyProperties', attributeName);
	},

	/**
	 * Add dirty relationship
	 *
	 * @private
	 * @param {string} relationshipName The relationship name.
	 */
	_addDirtyRelationship(relationshipName) {
		this._setDirtyProperty(relationshipName, true);
		this._safePushObject('dirtyRelationships', relationshipName);
		this._safePushObject('dirtyProperties', relationshipName);
	},

	/**
	 * Remove dirty relationship
	 *
	 * @private
	 * @param {string} relationshipName The relationship name.
	 */
	_removeDirtyRelationship(relationshipName) {
		this._setDirtyProperty(relationshipName, false);
		this._safeRemoveObject('dirtyRelationships', relationshipName);
		this._safeRemoveObject('dirtyProperties', relationshipName);
	},

	/**
	 * Safely add an object to an ArrayProxy
	 *
	 * @private
	 * @param {string} arrayName The array name
	 * @param {string} keyName The jkey name
	 */
	_safePushObject(arrayName, keyName) {
		if (!isEmpty(arrayName) && !isEmpty(keyName) && !isNone(this.get(arrayName)) && !this.get(arrayName).includes(keyName)) {
			this.get(arrayName).pushObject(keyName);
		}
	},

	/**
	 * Safely remove an object from an ArrayProxy.
	 *
	 * @private
	 * @param {string} arrayName The array name
	 * @param {string} keyName The key name
	 */
	_safeRemoveObject(arrayName, keyName) {
		if (!isEmpty(arrayName) && !isEmpty(keyName) && !isNone(this.get(arrayName)) && this.get(arrayName).includes(keyName)) {
			this.get(arrayName).removeObject(keyName);
		}
	},

	/**
	 * Set dirty property
	 *
	 * @private
	 * @param {string} propertyName The property name
	 * @param {boolean} isDirty Flag if the property is dirty
	 */
	_setDirtyProperty(propertyName, isDirty) {
		if (!isEmpty(propertyName)) {
			this.set(`${propertyName}Dirty`, isDirty);
		}
	},

	/**
	 * Observer the dirty attributes
	 */
	dirtyPropertiesChanged: observer('dirtyProperties.[]', function() {
		this.set('dirty', !isEmpty(this.get('dirtyProperties')));
	}),

	/**
	 * Observer the dirty attributes
	 */
	dirtyAttributesChanged: observer('dirtyAttributes.[]', function() {
		this.set('hasDirtyAttribute', !isEmpty(this.get('dirtyAttributes')));
	}),

	/**
	 * Observer the dirty attributes
	 */
	dirtyRelationshipsChanged: observer('dirtyRelationships.[]', function() {
		this.set('hasDirtyRelationship', !isEmpty(this.get('dirtyRelationships')));
	}),

	/**
	 * Init state.
	 * @private
	 */
	_initState() {
		this._resetFlags();
		this._saveAttributes();
	},

	/**
	 * Reset properties
	 * @private
	 */
	_resetFlags() {
		this.set('dirty', false);
		this.set('hasDirtyAttribute', false);
		this.set('hasDirtyRelationship', false);
		this.set('dirtyAttributes', A([]));
		this.set('dirtyRelationships', A([]));
		this.set('dirtyProperties', A([]));
		this.eachAttribute(attributeName => {
			this._setDirtyProperty(attributeName, false);
		});
		this.eachRelationship(relationshipName => {
			this._setDirtyProperty(relationshipName, false);
		});
	},

	/**
	 * Rollback state
	 * @private
	 */
	_rollbackState() {
		this._resetFlags();
		this._rollbackAttributes();
		this.eachRelationship((relationshipName, relationshipDescriptor) => {
			if (this._isBelongsToRelationship(relationshipDescriptor)) {
				this._rollbackBelongsToRelationshipState(relationshipName, relationshipDescriptor);
			} else if (this._isHasManyRelationship(relationshipDescriptor)) {
				this._rollbackHasManyRelationshipState(relationshipName, relationshipDescriptor);
			}
		});
	},

	/**
	 * Rollback attributes
	 * @private
	 */
	_rollbackAttributes() {
		this.eachAttribute(attributeName => {
			const savedAttributesMap = this.get('savedAttributesMap');
			if (!isNone(savedAttributesMap)) {
				this.set(attributeName, savedAttributesMap.get(attributeName));
			}
		});
	},

	/**
	 * Rollback the async belongsTo relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationship name.
	 * @param {object} relationshipDescriptor The relationship descriptor
	 */
	_rollbackBelongsToRelationshipState(relationshipName, relationshipDescriptor) {
		if (this._isBelongsToRelationshipLoaded(relationshipName)) {
			if (this._isAsyncRelationship(relationshipDescriptor)) {
				this._rollbackAsyncBelongsToRelationshipState(relationshipName);
			} else {
				this._rollbackSyncBelongsToRelationshipState(relationshipName);
			}
		}
	},

	/**
	 *  Rollback the async belongsTo relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_rollbackAsyncBelongsToRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			const belongsToModel = this.get(relationshipName);
			if (!isNone(belongsToModel) && !isNone(belongsToModel.content) && belongsToModel.get('dirty') === true) {
				belongsToModel.content._rollbackState();
			}
		}
	},

	/**
	 * Rollback the sync belongsTo relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_rollbackSyncBelongsToRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			const belongsToModel = this.get(relationshipName);
			if (!isNone(belongsToModel) && belongsToModel.get('dirty') === true) {
				belongsToModel._rollbackState();
			}
		}
	},

	/**
	 * Rollback the hasMany relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @param {object} relationshipDescriptor The relationship descriptor
	 */
	_rollbackHasManyRelationshipState(relationshipName, relationshipDescriptor) {
		if (this._isHasManyRelationshipLoaded(relationshipName)) {
			if (this._isAsyncRelationship(relationshipDescriptor)) {
				this._rollbackAsyncHasManyRelationshipState(relationshipName);
			} else {
				this._rollbackSyncHasManyRelationshipState(relationshipName);
			}
		}
	},

	/**
	 * Rollback the sync hasMany relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_rollbackSyncHasManyRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			this.get(relationshipName).forEach(hasManyModel => {
				if (!isNone(hasManyModel) && hasManyModel.get('dirty') === true) {
					hasManyModel._rollbackState();
				}
			});
		}
	},

	/**
	 * Rollback the async hasMany relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_rollbackAsyncHasManyRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			this.get(relationshipName).forEach(hasManyModel => {
				if (!isNone(hasManyModel) && hasManyModel.get('dirty') === true) {
					hasManyModel._rollbackState();
				}
			});
		}
	},

	/**
	 * Update the state
	 *
	 * @private
	 */
	_updateState() {
		this._resetFlags();
		this._saveAttributes();
		this._updateEachRelationshipState();
	},

	/**
	 * Update each relationship state.
	 *
	 * @private
	 */
	_updateEachRelationshipState() {
		this.eachRelationship((relationshipName, relationshipDescriptor) => {
			if (this._isBelongsToRelationship(relationshipDescriptor)) {
				this._updateBelongsToRelationshipState(relationshipName, relationshipDescriptor);
			} else if (this._isHasManyRelationship(relationshipDescriptor)) {
				this._updateHasManyRelationshipState(relationshipName, relationshipDescriptor);
			}
		});
	},

	/**
	 * Update belongsTo relationship state
	 *
	 * @param {string} relationshipName The relationship name.
	 * @param {object} relationshipDescriptor The relationship descriptor
	 */
	_updateBelongsToRelationshipState(relationshipName, relationshipDescriptor) {
		if (this._isBelongsToRelationshipLoaded(relationshipName)) {
			if (this._isAsyncRelationship(relationshipDescriptor)) {
				this._updateAsyncBelongsToRelationshipState(relationshipName);
			} else {
				this._updateSyncBelongsToRelationshipState(relationshipName);
			}
		}
	},

	/**
	 * Update async belongsTo relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_updateAsyncBelongsToRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			const belongsToModel = this.get(relationshipName);
			if (!isNone(belongsToModel) && !isNone(belongsToModel.content) && belongsToModel.get('dirty') === true) {
				belongsToModel.content._updateState();
			}
		}
	},

	/**
	 * Update sync belongsTo relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_updateSyncBelongsToRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			const belongsToModel = this.get(relationshipName);
			if (!isNone(belongsToModel) && belongsToModel.get('dirty') === true) {
				belongsToModel._updateState();
			}
		}
	},

	/**
	 * Update hasMany relationship state
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @param {object} relationshipDescriptor The relationship descriptor
	 */
	_updateHasManyRelationshipState(relationshipName, relationshipDescriptor) {
		if (this._isHasManyRelationshipLoaded(relationshipName)) {
			if (this._isAsyncRelationship(relationshipDescriptor)) {
				this._updateAsyncHasManyRelationshipState(relationshipName);
			} else {
				this._updateSyncHasManyRelationshipState(relationshipName);
			}
		}
	},

	/**
	 * Update sync hasMany relationship state.
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_updateSyncHasManyRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			this.get(relationshipName).forEach(hasManyModel => {
				if (!isNone(hasManyModel) && hasManyModel.get('dirty') === true) {
					hasManyModel._updateState();
				}
			});
		}
	},

	/**
	 * Update async hasMany relationship state.
	 *
	 * @private
	 * @param {string} relationshipName The relationshipName
	 */
	_updateAsyncHasManyRelationshipState(relationshipName) {
		if (!isEmpty(relationshipName)) {
			this.get(relationshipName).forEach(hasManyModel => {
				if (!isNone(hasManyModel) && hasManyModel.get('dirty') === true) {
					hasManyModel._updateState();
				}
			});
		}
	},

	/**
	 * Returns true if relationship is loaded asyncroniously
	 *
	 * @private
	 * @param {string} relationshipDescriptor The relationship descriptor
	 * @returns {boolean}
	 */
	_isAsyncRelationship(relationshipDescriptor) {
		if (isNone(relationshipDescriptor)) {
			return false;
		}
		if (isNone(relationshipDescriptor.options)) {
			return false;
		}
		if (isNone(relationshipDescriptor.options.async)) {
			return false;
		}
		return relationshipDescriptor.options.async;
	},

	/**
	 * Returns true if the belongsTo relationship is loaded, otherwise returns false.
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @returns {boolean}
	 */
	_isBelongsToRelationshipLoaded(relationshipName) {
		if (isEmpty(relationshipName)) {
			return false;
		}
		const belongsTo = this.belongsTo(relationshipName);
		return !isNone(belongsTo) && !isNone(belongsTo.value());
	},

	/**
	 * Returns true if the hasMany relationship is loaded, otherwise returns false.
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @returns {boolean}
	 */
	_isHasManyRelationshipLoaded(relationshipName) {
		if (isEmpty(relationshipName)) {
			return false;
		}
		const hasManyRef = this.hasMany(relationshipName);
		return !isNone(hasManyRef) && !isNone(hasManyRef.value());
	},

	/**
	 * Saved the current attributes values.
	 *
	 * @private
	 */
	_saveAttributes() {
		this.set('savedAttributesMap', EmberObject.create());
		this.eachAttribute(attributeName => {
			const savedValue = this.get(attributeName);
			if (!isEmpty(savedValue)) {
				this.get('savedAttributesMap').set(attributeName, savedValue);
			}
		});
	},

	/**
	 * Returns true if attribute is dirty, otherwise returns false.
	 *
	 * @private
	 * @param {string} attributeName The attribute name
	 * @returns {boolean}
	 */
	_isDirtyAttribute(attributeName) {
		if (isEmpty(attributeName)) {
			return false;
		}
		if (isEmpty(this.get('savedAttributesMap'))) {
			return false;
		}
		// get saved value.
		const savedValue = this.get('savedAttributesMap').get(attributeName);
		// get new value.
		const newValue = this.get(attributeName);
		if (isEmpty(savedValue) && isEmpty(newValue)) {
			return false;
		}
		return JSON.stringify(savedValue) !== JSON.stringify(newValue);
	},

	/**
	 * Returns true if its belongsTo relationship, otherwise returns false.
	 *
	 * @private
	 * @param {object} relationshipDescriptor The relationship descriptor
	 * @returns {boolean}
	 */
	_isBelongsToRelationship(relationshipDescriptor) {
		return !isEmpty(relationshipDescriptor) && relationshipDescriptor.kind === 'belongsTo';
	},

	/**
	 * Returns true if its hasMany relationship, otherwise returns false.
	 *
	 * @private
	 * @param {object} relationshipDescriptor The relationship descriptor
	 * @returns {boolean}
	 */
	_isHasManyRelationship(relationshipDescriptor) {
		return !isEmpty(relationshipDescriptor) && relationshipDescriptor.kind === 'hasMany';
	},

	/**
	 * Returns true if the hasMany relationship is dirty
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @returns {boolean}
	 */
	_isHasManyRelationshipDirty(relationshipName) {
		if (isEmpty(relationshipName)) {
			return false;
		}
		if (!this._isHasManyRelationshipLoaded(relationshipName)) {
			return false;
		}
		const hasManyModels = this.get(relationshipName);
		if (!isEmpty(hasManyModels) && !isEmpty(hasManyModels.filterBy('dirty', true))) {
			return true;
		}
		return false;
	},

	/**
	 * Returns true if the belongsTo relationship is dirty
	 *
	 * @private
	 * @param {string} relationshipName The relationship name
	 * @returns {boolean}
	 */
	_isBelongsToRelationshipDirty(relationshipName) {
		if (isEmpty(relationshipName)) {
			return false;
		}
		if (!this._isBelongsToRelationshipLoaded(relationshipName)) {
			return false;
		}
		const belongsToModel = this.get(relationshipName);
		if (!isNone(belongsToModel) && belongsToModel.get('dirty') === true) {
			return true;
		}
		return false;
	},

	rollback() {
		this._rollbackState();
	},

	isDirty() {
		return this.get('dirty');
	},

	/**
	 * ready hook.
	 */
	ready() {
		this._super(...arguments);
		this._initState();
		this._addObservers();
	},

	/*
    * didCreate hook.
    */
	didCreate() {
		this._updateState();
	},

	/**
	 * didDelete hook.
	 */
	didDelete() {
		this._updateState();
	},

	/**
	 * didUpdate hook.
	 */
	didUpdate() {
		this._updateState();
	}
});
