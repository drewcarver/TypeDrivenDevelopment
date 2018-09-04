import * as React from 'react';
import { connect } from 'react-redux';

import { ReducerState } from './redux';
import * as UserActions from './redux/userReducer';
import { User } from './types/User';

type UserProps = User;

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
    return (event: React.ChangeEvent<HTMLInputElement>) => func(event.target.value);
};

const User = (props: UserProps & typeof UserActions) => <div>
    First Name:
    <input 
        value={props.firstName} 
        onChange={withEventValue(props.changeFirstName)}
    />
    Last Name:
    <input 
        value={props.lastName}
        onChange={withEventValue(props.changeLastName)}
    />
    Email:
    <input 
        value={props.email.address} 
        onChange={withEventValue(props.changeEmail)}
    />
    <span>Valid Email? {props.email.isValid ? 'Yes' : 'No'}</span>
</div>;

const mapStateToProps = (state: ReducerState)  => ({ 
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
});

export default connect(mapStateToProps, { ...UserActions })(User);