import React from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  AsyncStorage,
  ScrollView,
  ToastAndroid,
  CheckBox
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import axios from "react-native-axios";
import {
  createAppContainer,
  createStackNavigator,
  StackActions,
  NavigationActions
} from "react-navigation";
import MultiSelect from "react-native-multiple-select";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      province: ""
    };
    this.wipeData();
  }

  wipeData = async () => {
    try {
      await AsyncStorage.setItem(
        "patientData",
        JSON.stringify({ patients: [] })
      );
    } catch (error) {
      console.log("INIT ERROR " + error);
      // Error saving data
    }
  };

  getValue = input => {
    this.state[input].toString();
  };

  onChange = (event, id) => {
    const value = event.nativeEvent.text;
    this.setState({ [id]: value });
  };

  addPatient = () => {
    this.props.navigation.dispatch(
      NavigationActions.navigate(
        { routeName: "Patient" },
        { city: this.state.city, province: this.state.province }
      )
    );
  };
  // savetoServer = async () => {
  //   let dataSet = JSON.parse(await AsyncStorage.getItem("patientData"));
  //   //206.87.108.157
  //   console.log(JSON.stringify(dataSet));
  //   axios
  //     .post("http://192.168.43.107:8080/api/users", JSON.stringify(dataSet))
  //     .then(function(response) {
  //       console.log(response);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // };
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          marginTop: 10,
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="City"
          style={{
            height: 40,
            width: 200,
            borderColor: "gray",
            borderWidth: 1
          }}
          onChange={event => {
            this.onChange(event, "city");
          }}
          value={this.getValue("city")}
        />
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="Province"
          style={{
            height: 40,
            width: 200,
            borderColor: "gray",
            borderWidth: 1
          }}
          onChange={event => {
            this.onChange(event, "province");
          }}
          value={this.getValue("province")}
        />
        <Text>{"\n"}</Text>
        <Button onPress={this.addPatient} title="add Patient" color="#ff8800" />
        <Text>{"\n"}</Text>
      </View>
    );
  }
}

class PatientScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all: "",
      vac: "",
      chron: "",
      symp: "",
      meds: "",
      surg: "",
      id: "",
      first_name: "",
      last_name: "",
      sex: "",
      city: "",
      province: "",
      day: 0,
      month: 0,
      year: 0,
      weight: 0,
      blood_type: "",
      heightft: 0,
      heightin: 0,
      allergies: [],
      flushot: false,
      ubc: true,
      chronic_health_problems: [],
      alcohol_consumption: "",
      smoking: "",
      blood_pressure_systolic: 0,
      blood_pressure_diastolic: 0,
      surgeries: [],
      symptoms: [],
      vaccinations: [],
      medications: []
    };
  }
  onInt = (event, id) => {
    const value = event.nativeEvent.text;
    console.log(value);
    console.log(/^\d+$/.test(value));
    if (/^\d+$/.test(value)) {
      let val = value;
      switch (id) {
        case "day":
          if (val < 32) {
            this.setState({ [id]: parseInt(value) });
          } else {
            this.setState({ day: this.state.day });
            ToastAndroid.show("Max 31 days", ToastAndroid.SHORT);
          }
          break;
        case "month":
          if (val < 13) {
            this.setState({ [id]: parseInt(value) });
          } else {
            this.setState({ month: this.state.month });
            ToastAndroid.show("12 = December", ToastAndroid.SHORT);
          }
          break;
        case "year":
          this.setState({ [id]: parseInt(value) });
          break;
        case "weight":
          this.setState({ [id]: parseInt(value) });
          break;
        case "heightft":
          this.setState({ [id]: parseInt(value) });
          break;
        case "heightin":
          if (value < 12) this.setState({ [id]: parseInt(value) });
          else {
            this.setState({ heightin: this.state.heightin });
            ToastAndroid.show("No more than 12in per feet", ToastAndroid.SHORT);
          }
          break;
        case "blood_pressure_systolic":
          this.setState({ [id]: parseInt(value) });
          break;
        case "blood_pressure_diastolic":
          this.setState({ [id]: parseInt(value) });
          break;
        default:
          break;
      }
    } else if (value.length === 0) {
      this.setState({ [id]: 0 });
    }
  };

  getValue = input => {
    if (this.state[input] && this.state[input] != 0)
      return this.state[input].toString();
    else return "";
  };

  onChange = (event, id) => {
    const value = event.nativeEvent.text;
    this.setState({ [id]: value });
  };

  async componentDidMount() {
    this.props.navigation.addListener("willFocus", this.clear);
  }
  clear = () => {
    this.setState({
      all: "",
      vac: "",
      chron: "",
      symp: "",
      meds: "",
      surg: "",
      id: "",
      first_name: "",
      last_name: "",
      sex: "",
      city: "",
      province: "",
      month: 0,
      year: 0,
      weight: 0.0,
      blood_type: "",
      flushot: false,
      heightft: 0,
      heightin: 0,
      allergies: [],
      chronic_health_problems: [],
      alcohol_consumption: "",
      smoking: "",
      blood_pressure_systolic: 0,
      blood_pressure_diastolic: 0,
      surgeries: [],
      symptoms: [],
      vaccinations: [],
      medications: []
    });
  };
  addPatient = () => {
    let data = {
      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      sex: this.state.sex,
      city: this.props.navigation.getParam("city", "no-city"),
      province: this.props.navigation.getParam("province", "no-province"),
      date:
        this.state.year.toString() +
        "-" +
        this.state.month.toString() +
        "-" +
        this.state.day.toString(),
      weight: this.state.weight * 0.453592,
      blood_type: this.state.blood_type,
      flushot: this.state.flushot,
      height: Math.round(
        this.state.heightft * 30.48 + this.state.heightin * 2.54
      ),
      allergies: this.state.all,
      chronic_health_problems: this.state.chron,
      alcohol_consumption: this.state.alcohol_consumption,
      smoking: this.state.smoking,
      blood_pressure_systolic: this.state.blood_pressure_systolic,
      blood_pressure_diastolic: this.state.blood_pressure_diastolic,
      surgeries: this.state.surg,
      symptoms: this.state.symp,
      vaccinations: this.state.vac,
      ubc: true,
      medications: this.state.meds
    };
    console.log(JSON.stringify(data));
    axios
      .post("http://192.168.43.107:8080/api/users", JSON.stringify(data))
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    // let dataSet = JSON.parse(await AsyncStorage.getItem("patientData"));
    // dataSet.patients.push(data);
    // const string = JSON.stringify(dataSet);
    // try {
    //   await AsyncStorage.mergeItem("patientData", string);
    //   this.props.navigation.dispatch(
    //     NavigationActions.navigate({ routeName: "Home" })
    //   );
    // } catch (error) {
    //   console.log(error);
    //   // Error retrieving data
    // }
  };
  onSelectedItemsChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ vaccinations: selectedItems, vac: string });
  };
  onSelectedAllergensChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ allergies: selectedItems, all: string });
  };
  onSelectedChronicChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ chronic_health_problems: selectedItems, chron: string });
  };
  onSelectedMedicationChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ medications: selectedItems, med: string });
  };
  onSelectedSymptomChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ symptoms: selectedItems, symp: string });
  };
  onSelectedSurgeryChange = selectedItems => {
    let string = "";
    for (let x = 0; x < selectedItems.length; x++) {
      string += selectedItems[x] + "#";
    }
    this.setState({ surgeries: selectedItems, surg: string });
  };

  load = async () => {};
  render() {
    let vaccines = [
      {
        id: "Whooping Cough",
        name: "Whooping Cough"
      },
      {
        id: "Tetanus",
        name: "Tetanus"
      },
      {
        id: "Shingles",
        name: "Shingles"
      },
      {
        id: "Penumococcal Disease",
        name: "Penumococcal Disease"
      },
      {
        id: "HPV",
        name: "HPV"
      },
      {
        id: "Hep",
        name: "Hep"
      },
      {
        id: "Measels",
        name: "Measels"
      },
      {
        id: "Mumps",
        name: "Mumps"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let chronic = [
      {
        id: "Alcoholism",
        name: "Alcoholism"
      },
      {
        id: "Diabetes",
        name: "Diabetes"
      },
      {
        id: "Dimentia",
        name: "Dimentia"
      },
      {
        id: "Cancer",
        name: "Cancer"
      },
      {
        id: "Obesity",
        name: "Obesity"
      },
      {
        id: "Arthritis",
        name: "Arthritis"
      },
      {
        id: "Asthma",
        name: "Asthma"
      },
      {
        id: "Heart and Stroke",
        name: "Heart and Stroke"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let allergens = [
      {
        id: "Dairy",
        name: "Dairy"
      },
      {
        id: "Eggs",
        name: "Eggs"
      },
      {
        id: "Peanuts",
        name: "Peanuts"
      },
      {
        id: "Tree Nuts",
        name: "Tree Nuts"
      },
      {
        id: "Dust",
        name: "Dust"
      },
      {
        id: "Wheat",
        name: "Wheat"
      },
      {
        id: "ShellFish",
        name: "ShellFish"
      },
      {
        id: "Fish",
        name: "Fish"
      },
      {
        id: "Soy",
        name: "Soy"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let surgeries = [
      {
        id: "Triple Bypass",
        name: "Triple Bypass"
      },
      {
        id: "Heart",
        name: "Heart"
      },
      {
        id: "Knee",
        name: "Knee"
      },
      {
        id: "Hip",
        name: "Hip"
      },
      {
        id: "Back",
        name: "Back"
      },
      {
        id: "Shoulder",
        name: "Shoulder"
      },
      {
        id: "Head",
        name: "Head"
      },
      {
        id: "Liver",
        name: "Liver"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let symptomes = [
      {
        id: "Cough",
        name: "Cough"
      },
      {
        id: "Cold",
        name: "Cold"
      },
      {
        id: "Fever",
        name: "Fever"
      },
      {
        id: "Sore Throat",
        name: "Sore Throat"
      },
      {
        id: "Pain",
        name: "Pain"
      },
      {
        id: "Depression",
        name: "Depression"
      },
      {
        id: "Headache",
        name: "Headache"
      },
      {
        id: "Rash",
        name: "Rash"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let medications = [
      {
        id: "Tylenol",
        name: "Tylenol"
      },
      {
        id: "Advil",
        name: "Advil"
      },
      {
        id: "Cough Syrup",
        name: "Cough Syrup"
      },
      {
        id: "Aspirin",
        name: "Aspirin"
      },
      {
        id: "Antihistamine",
        name: "Antihistamine"
      },
      {
        id: "Marijuana",
        name: "Marijuana"
      },
      {
        id: "Gravol",
        name: "Gravol"
      },
      {
        id: "Pepto Bismol",
        name: "Pepto Bismol"
      },
      {
        id: "None",
        name: "None"
      }
    ];
    let sex = [
      {
        value: "Male"
      },
      {
        value: "Female"
      },
      {
        value: "Other"
      }
    ];
    let addiction = [
      {
        value: "Never"
      },
      {
        value: "Yearly"
      },
      {
        value: "Monthly"
      },
      {
        value: "Weekly"
      },
      {
        value: "Daily"
      }
    ];
    let bloodtype = [
      {
        value: "O+"
      },
      {
        value: "O-"
      },
      {
        value: "A+"
      },
      {
        value: "A-"
      },
      {
        value: "B+"
      },
      {
        value: "B-"
      },
      {
        value: "AB+"
      },
      {
        value: "AB-"
      }
    ];
    return (
      <ScrollView>
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="Med ID"
          style={{
            height: 40
          }}
          underlineColorAndroid="#000"
          onChange={event => {
            this.onChange(event, "id");
          }}
          value={this.getValue("id")}
        />
        <Text>{"\n"}</Text>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          <TextInput
            placeholder="First Name"
            style={{
              height: 40
            }}
            underlineColorAndroid="#000"
            onChange={event => {
              this.onChange(event, "first_name");
            }}
            value={this.getValue("first_name")}
          />
          <Text>{"  "}</Text>
          <TextInput
            placeholder="Last Name"
            style={{
              height: 40
            }}
            underlineColorAndroid="#000"
            onChange={event => {
              this.onChange(event, "last_name");
            }}
            value={this.getValue("last_name")}
          />
        </View>
        <Text>Date of Birth</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          <TextInput
            placeholder="DD"
            style={{
              height: 40,
              width: 30,
              borderColor: "gray",
              borderWidth: 1
            }}
            onChange={event => {
              this.onInt(event, "day");
            }}
            value={this.getValue("day")}
            maxLength={2}
            keyboardType="numeric"
          />
          <Text>{" - "}</Text>
          <TextInput
            placeholder="MM"
            style={{
              height: 40,
              width: 30,
              borderColor: "gray",
              borderWidth: 1
            }}
            onChange={event => {
              this.onInt(event, "month");
            }}
            value={this.getValue("month")}
            maxLength={2}
            keyboardType="numeric"
          />
          <Text>{" - "}</Text>
          <TextInput
            placeholder="YYYY"
            style={{
              height: 40,
              width: 50,
              borderColor: "gray",
              borderWidth: 1
            }}
            onChange={event => {
              this.onInt(event, "year");
            }}
            value={this.getValue("year")}
            maxLength={4}
            keyboardType="numeric"
          />
        </View>
        <Text>{"\n"}</Text>
          <Dropdown
            style={{
              height: 40
            }}
            label="Sex"
            data={sex}
            onChangeText={value => {
              this.setState({ sex: value.toString() });
            }}
          />
        <Dropdown
          style={{
            height: 40
          }}
          label="BloodType"
          data={bloodtype}
          onChangeText={value => {
            this.setState({ blood_type: value.toString() });
          }}
        />
        <Dropdown
          style={{
            height: 40
          }}
          label="Alcohol Consumption"
          data={addiction}
          onChangeText={value => {
            this.setState({ alcohol_consumption: value.toString() });
          }}
        />
        <Dropdown
          style={{
            height: 40
          }}
          label="Smoking"
          data={addiction}
          onChangeText={value => {
            this.setState({ smoking: value.toString() });
          }}
        />
        
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          <Text>{"\n"}</Text>

          <Text>Height</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              alignItems: "center"
            }}
          >
            <TextInput
              placeholder="ft"
              style={{
                height: 40,
                width: 20,
                borderColor: "gray",
                borderWidth: 1
              }}
              onChange={event => {
                this.onInt(event, "heightft");
              }}
              value={this.getValue("heightft")}
              maxLength={1}
              keyboardType="numeric"
            />
            <Text>"</Text>
            <TextInput
              placeholder="in"
              style={{
                height: 40,
                width: 30,
                borderColor: "gray",
                borderWidth: 1
              }}
              onChange={event => {
                this.onInt(event, "heightin");
              }}
              value={this.getValue("heightin")}
              maxLength={2}
              keyboardType="numeric"
            />
            <Text>'</Text>
          </View>
        </View>
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="Weight (lb)"
          style={{
            height: 40
          }}
          underlineColorAndroid="#000"
          onChange={event => {
            this.onInt(event, "weight");
          }}
          value={this.getValue("weight")}
        />
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="blood_pressure_systolic"
          style={{
            height: 40
          }}
          underlineColorAndroid="#000"
          onChange={event => {
            this.onInt(event, "blood_pressure_systolic");
          }}
          value={this.getValue("blood_pressure_systolic")}
        />
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="blood_pressure_diastolic"
          style={{
            height: 40
          }}
          underlineColorAndroid="#000"
          onChange={event => {
            this.onInt(event, "blood_pressure_diastolic");
          }}
          value={this.getValue("blood_pressure_diastolic")}
        />
        <Text>{"\n"}</Text>
        <MultiSelect
          hideTags
          items={symptomes}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedSymptomChange}
          selectedItems={this.state.symptoms}
          selectText="Pick Symptomes"
          searchInputPlaceholderText="Search Symptomes..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <MultiSelect
          hideTags
          items={allergens}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedAllergensChange}
          selectedItems={this.state.allergies}
          selectText="Pick Allergies"
          searchInputPlaceholderText="Search Allergies..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <MultiSelect
          hideTags
          items={chronic}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedChronicChange}
          selectedItems={this.state.chronic_health_problems}
          selectText="Pick Health Conditions"
          searchInputPlaceholderText="Search Conditions..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
       
        <MultiSelect
          hideTags
          items={medications}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedMedicationChange}
          selectedItems={this.state.medications}
          selectText="Pick Medications"
          searchInputPlaceholderText="Search Medications..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <MultiSelect
          hideTags
          items={vaccines}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.vaccinations}
          selectText="Pick Vaccines"
          searchInputPlaceholderText="Search Vaccines..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <MultiSelect
          hideTags
          items={surgeries}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedSurgeryChange}
          selectedItems={this.state.surgeries}
          selectText="Pick Surgeries"
          searchInputPlaceholderText="Search Surgeries..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          <Text>Flushot in the past year</Text>
          <CheckBox
            value={this.state.flushot}
            onValueChange={() => {
              this.setState({ flushot: !this.state.flushot });
            }}
          />
          <Text>{"\n"}</Text>

          <Button
            onPress={this.addPatient}
            title="add Patient"
            color="#ff8800"
          />
        </View>
      </ScrollView>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Patient: {
      screen: PatientScreen
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);
