import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Spaces from '../Spaces';
import * as Queries from '../../queries';
import * as Mutations from '../../mutations';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Typography, Alert } from 'antd';
import { Navbar, Button, FullScreenSpinner } from '../Core';
import * as UserServices from '../../services/UserServices';

const { Title } = Typography;

import styles from './styles/UserSpaces.module.scss';

function UserSpaces(props) {
	const [state, setState] = useState({
		loading: false,
		selectedSpaces: [],
		showAlert: false,
		alertMessage: 'An error occurred',
	});

	const createSelectedSpaces = (data) => {
		// Take all the ids of the spaces that are being read by this user
		// Push them into the state array

		let selectedSpaces = [];

		data.getUserSpaces.user[0].spaces.forEach((space) => {
			selectedSpaces.push(space._id);
		});

		setState((state) => ({ ...state, selectedSpaces: selectedSpaces }));
	};

	/**
	 * Change the selected spaces based on whether a new space was selected or an existing one was de selected
	 * @param {String} _id ID of the space on which the user clicked
	 * @param {Boolean} selected Whether this space was already selected or not
	 */
	const handleSpaceClick = (_id, selected) => {
		if (_id) {
			let selectedSpaces = [...state.selectedSpaces];
			if (selected) {
				// Selected was un selected
				selectedSpaces = selectedSpaces.filter(
					(existingId) => existingId !== _id
				);
			} else {
				// New was selected
				selectedSpaces.push(_id);
			}
			setState((prev) => ({ ...prev, selectedSpaces }));
		}
	};

	/**
	 * Function fires when clicked on Get Started button. Save user's space settings.
	 */
	const handleGetStartedClick = async () => {
		setState((prev) => ({ ...prev, loading: true, showAlert: false }));

		const result = await UserServices.updateUserSpaces(
			changeUserSpaces,
			state.selectedSpaces
		);

		if (result.error) {
			setState((prev) => ({
				...prev,
				showAlert: true,
				alertMessage: result.error.message,
			}));
		} else {
			// Success
			props.history.push('/home');
		}

		return;
	};

	useEffect(() => {
		fetchUserSpaces();
	}, []);

	const [
		fetchUserSpaces,
		{ userSpacesLoading, userSpacesError },
	] = useLazyQuery(Queries.GET_USER_SPACES, {
		onCompleted: (data) => createSelectedSpaces(data),
	});
	const userResult = useQuery(Queries.SIGN_IN_USER, {
		variables: { email: '', password: '' },
	});
	const [changeUserSpaces] = useMutation(Mutations.CHANGE_USER_SPACES);

	if (userResult.loading || userResult.loading || userSpacesLoading) {
		return <FullScreenSpinner />;
	}

	if (userResult.error || userResult.data.signInUser.status !== 'OK') {
		props.history.push('/signin');
		return null;
	}

	// if (userSpacesResult.error || userSpacesResult.data.getUserSpaces.status !== "OK") {
	//   props.history.push("/signin");
	//   return null;
	// }

	return (
		<div>
			<Navbar />
			<main className={cx(styles.mainContainer, 'globalContainer')}>
				<section className={cx(styles.spacesContainer)}>
					<Title level={2}>
						Select your <strong>spaces</strong>
					</Title>
					<Title level={4}>
						You will be suggested content based on your selection.
						You can change this at any time.
					</Title>
					<Spaces
						selectedSpaces={state.selectedSpaces}
						onClick={(_id, selected) =>
							handleSpaceClick(_id, selected)
						}
					/>
					<Button
						shape="round"
						htmlType="submit"
						color="secondary"
						disabled={
							state.loading || state.selectedSpaces.length === 0
						}
						style={{ marginTop: '64px' }}
						onClick={() => handleGetStartedClick()}
					>
						Get Started
					</Button>

					{state.showAlert && (
						<Alert
							message={state.alertMessage}
							afterClose={() =>
								setState((prev) => ({
									...prev,
									showAlert: false,
								}))
							}
							type="error"
							showIcon
							closable
							className={cx(styles.alertBar)}
						/>
					)}
				</section>
			</main>
		</div>
	);
}

export default UserSpaces;
