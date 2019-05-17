import React from "react";
import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity
} from "react-native";

import style from "./style";

import * as firebase from "firebase";

import auth from "./auth";

export default class extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
			title: "",
			ingredient: [],
			note: "",
			step: [],

			err: null
    };
  }

	componentDidMount() {
		const
			root = firebase.database().ref(),
      ref = root.child("recipe");

		ref.on("value", snap => {
			this.setState(
				{
					recipe: snap.val()[this.props.navigation.getParam("k")]
				},
				() => {
					this.setState({
						title: this.state.recipe.title,
						ingredient: this.state.recipe.ingredient,
						note: this.state.recipe.note,
						step: this.state.recipe.step
					});
				}
			);
		});
	}

	update = () => {
		const
			root = firebase.database().ref(),
			ref = root.child("recipe/" + this.props.navigation.getParam("k"));

		ref.update(
			{
				title: this.state.title,
				ingredient: this.state.ingredient,
				note: this.state.note,
				step: this.state.step
			}
		);

		this.props.navigation.navigate(
			"Recipe",
			{
				k: this.props.navigation.getParam("k")
			}
		);
	}

  render() {
		return (
			<ScrollView
				style={style.cont}
			>
				<Text>Title</Text>

				<TextInput
					placeholder="Title"
					autoCapitalize="none"
					onChangeText={
						title => this.setState({
							title: title
						})
					}
					value={this.state.title}
					style={style.field}
				/>

				<Text>
					Notes
				</Text>

				<TextInput
					placeholder="Notes"
					autoCapitalize="none"
					onChangeText={
						note => this.setState({
							note: note
						})
					}
					value={this.state.note}
					style={style.field}
				/>

				<View
					style={style.cont}
				>
					<Text>
						Ingredients
					</Text>

					<TouchableOpacity
						onPress={
							() => {
								this.setState({
									ingredient: [
										...this.state.ingredient,
										""
									]
								});
							}
						}
					>
						<Text>
							New
						</Text>
					</TouchableOpacity>

					<View>
						{
							this.state.ingredient.map((val, i) => {
								return (
									<TextInput
										key={i}
										placeholder="Ingredient"
										style={
											style.field
										}
										onChangeText={
											(txt) => {
												this.state.ingredient[i] = txt;
											}
										}
									>{val}</TextInput>
								)
							})
						}
					</View>
				</View>

				<View
					style={style.cont}
				>
					<Text>
						Steps
					</Text>

					<TouchableOpacity
						onPress={
							() => {
								this.setState({
									step: [
										...this.state.step,
										{
											header: "",
											desc: ""
										}
									]
								});
							}
						}
					>
						<Text>
							New
						</Text>
					</TouchableOpacity>

					<View>
						{
							this.state.step.map((val, i) => {
								return (
									<View
										key={i}
									>
										<Text>{i}</Text>

										<TextInput
											placeholder="Header"
											onChangeText={
												(txt) => {
													this.state.step[i]["header"] = txt;
												}
											}
											style={style.field}
										>{val.header}</TextInput>

										<TextInput
											placeholder="Instructions"
											onChangeText={
												(txt) => {
													this.state.step[i]["desc"] = txt;
												}
											}
											style={style.field}
										>{val.desc}</TextInput>
									</View>
								)
							})
						}
					</View>
				</View>

				<View
					style={style.cont}
				>
					<TouchableOpacity
						onPress={this.update}
					>
						<Text>
							Enter
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
  }
}