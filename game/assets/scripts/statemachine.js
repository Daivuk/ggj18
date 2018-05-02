/**
 * Finite State Machine Constructor.
 */
function OStateMachine() {
    this.emptyState = {};
    this.stack = [this.emptyState];

    this._enterState = function (state) {
        if (state['onEnter'] !== undefined) {
            state.onEnter();
        }
    }

    this._exitState = function (state) {
        if (state['onExit'] !== undefined) {
            state.onExit();
        }
    }
}

/**
 * Returns the current state. If none was set, a default empty state will be 
 * returned.
 */
OStateMachine.prototype.getState = function () {
    return this.stack[this.stack.length - 1];
};

/**
 * Convenient function that checks if a function is available in the current
 * state, and calls it if it is available. Arguments are optionsl
 */
OStateMachine.prototype.trigger = function (funcName, arg0, arg1, arg2, arg3, arg4) {
    var state = this.getState();
    if (state[funcName] !== undefined) {
        state[funcName](arg0, arg1, arg2, arg3, arg4);
    }
};

/**
 * Pushes a state on the state stack. current state onExit() function will be
 * called if available on that state. new state onEnter() function will be
 * called if available on the new state.
 */
OStateMachine.prototype.pushState = function (state) {
    var currState = this.getState();

    if (state === undefined || state === null || currState === state) {
        return;
    }

    this._exitState(currState);
    this.stack.push_back(state);
    this._enterState(state);
};

/**
 * Pops the current state.  The Current state onExit() function will be
 * called if available on that state. If the stack is empty, this function will
 * do nothing. Please note that you cannot pop the default empty state.
 */
OStateMachine.prototype.popState = function () {
    if (this.stack.length > 1) {
        this._exitState(this.stack.pop());
        this._enterState(this.getState());
    }
};

/**
 * Replaces the current state with a new state. The current state onExit()
 * function will be called if available on that state. new state onEnter()
 * function will be called if available on the new state. Please note that you
 * cannot replace the empty default state, and it will push the new state
 * instead.
 */

OStateMachine.prototype.setState = function (state) {
    var currState = this.getState();

    if (state === undefined || state === null || currState === state) {
        return;
    }

    if (this.currState === this.emptyState) {
        this.stack.push_back(state);
    } else {
        this._exitState(currState);
        this.stack[this.stack.length - 1] = state;
    }

    this._enterState(state);
};
