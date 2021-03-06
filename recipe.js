import React from "react";
import {
	ScrollView,
	Text,
	View,
	TouchableOpacity
} from "react-native";

import Head from "./head";

import style from "./style";

import * as firebase from "firebase";

import auth from "./auth";

export default class extends React.Component {
	constructor() {
    super();

    this.state = {
      recipe: [],

			user: {}
    };
  }

	componentDidMount() {
		const
			root = firebase.database().ref(),
			ref = root.child("recipe");

		ref.on("value", snap => {
			this.setState( {
				recipe: snap.val()[this.props.navigation.getParam("k")]
			});
		});

		firebase.auth().onAuthStateChanged((user) => {
				this.setState({
					user: user
				});
			}
		);
	}

  render() {
		let recipe = this.state.recipe;

    return (
			<ScrollView
				contentContainerStyle={style.cont}
			>
				<Head
					navigation={this.props.navigation}
				/>

				{
					(this.state.user && recipe.email == this.state.user.email) && (
						<View
							style={style.cont}
						>
							<TouchableOpacity
								onPress={
									() => {
										this.props.navigation.navigate(
											"Edit",
											{
												k: this.props.navigation.getParam("k")
											}
										)
									}
								}
							>
								<Text>Edit</Text>
							</TouchableOpacity>
						</View>
					)
				}

				<View
					style={style.cont}
				>
					<Text
						style={style.h1}
					>{recipe.title}</Text>

					<Text
						style={style.h2}
					>{recipe.author}</Text>
				</View>

				{
					recipe.note != "" && (
						<View
							style={style.cont}
						>
							<Text
								style={style.h3}
							>Notes</Text>

							<Text>{recipe.note}</Text>
						</View>
					)
				}

				<View
					style={style.cont}
				>
					<Text
						style={style.h3}
					>Ingredients</Text>

					{
						recipe.ingredient != undefined
							? recipe.ingredient.map((inst, k) => {
								return (
									<Text
										key={k}
									>{`\u2022 ${inst}`}</Text>
								);
							})
							: <Text>...</Text>
					}
				</View>

				<View>
					<View
						style={style.cont}
					>
						<Text
							style={style.h3}
						>Steps</Text>
					</View>

					{
						recipe.step != undefined
							? recipe.step.map((inst, i) => {
								return (
									<View
										key={i}
										style={{
											flexDirection: "row"
										}}
									>
										<View
											style={style.cont}
										>
											<Text
												style={[
													style.h2,
													style.header
												]}
											>{i + 1}</Text>
										</View>

										<View
											style={[
												style.cont,
												{
													flex: 1
												}
											]}
										>
											<Text
												style={[
													style.h3,
													style.desc
												]}
											>{inst.header}</Text>
											<Text>{inst.desc}</Text>
										</View>
									</View>
								);
							})
							: <Text>...</Text>
					}
				</View>
			</ScrollView>
    );
  }
}
