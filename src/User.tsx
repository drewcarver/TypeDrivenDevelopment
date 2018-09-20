import * as React from 'react';
import { connect } from 'react-redux';

import { ReducerState } from './redux';
import * as UserActions from './redux/userReducer';
import { User } from './types/User';

type UserProps = { 
    user: User
};

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
    return (event: React.ChangeEvent<HTMLInputElement>) => func(event.target.value);
};

const User = (props: UserProps & typeof UserActions) => <div>
    First Name:
    <input 
        value={props.user.firstName} 
        onChange={withEventValue(props.changeFirstName)}
    />
    Last Name:
    <input 
        value={props.user.lastName}
        onChange={withEventValue(props.changeLastName)}
    />
    Email:
    <input 
        value={props.user.email.address} 
        onChange={withEventValue(props.changeEmail)}
    />
    <span>
        {
            props.user.email.match({
                Initial: () => '',
                Invalid: incompleteEmail => incompleteEmail.errors.join('|'),
                Valid: email => `${email.address} is a valid email!`
            })
        }
    </span>
    <button onClick={props.save}>Save</button>
</div>;

const mapStateToProps = (state: ReducerState)  => ({ 
    user: state.user
});

export default connect(mapStateToProps, { ...UserActions })(User);