import javafx.application.*;
import javafx.scene.*;
import javafx.stage.*;
import javafx.beans.property.*;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.event.*;
import java.util.ArrayList;
import javafx.geometry.*;
import javafx.collections.*;
import javafx.scene.control.cell.*;
import javafx.util.*;

public class TableCellEditing extends Application {

  private void init(Stage primaryStage) {
    StackPane root = new StackPane();
    primaryStage.setScene(new Scene(root, 400, 200));
    // you didn't provided data which your Tables use so example will work with Person class
    final ObservableList<Person> data = FXCollections.observableArrayList
      (
       new Person("click to edit", "Smith"),
       new Person("", "Johnson"),
       new Person("", "Williams1"),
       new Person("", "Williams2"),
       new Person("", "Williams3"),
       new Person("", "Williams4"),
       new Person("", "Williams5"),
       new Person("", "Jones"),
       new Person("", "Brown"),
       new Person("", "Brown2"));

    TableView tableView = new TableView();
    tableView.setItems(data);
    // make table editable
    tableView.setEditable(true);

    TableColumn lastNameCol = new TableColumn();
    lastNameCol.setText("Last");
    lastNameCol.setCellValueFactory(new PropertyValueFactory("lastName"));


    TableColumn firstNameCol = new TableColumn();
    firstNameCol.setText("First");
    // here you connect data list with table column
    firstNameCol.setCellValueFactory(new PropertyValueFactory("firstName"));
    // here you specify that your cells are special and provide editing hooks
    firstNameCol.setCellFactory(new Callback<TableColumn, TableCell>() {
        @Override
          public TableCell call(final TableColumn param) {

          final TableCell cell = new TableCell() {
              @Override
              // this method is called on editable tables by double click
              public void startEdit() {
                super.startEdit();
                // here we create new Stage to select items from tree
                new CheckBoxTreeStage(this).show();
              }

              @Override
              public void updateItem(Object item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                  setText(null);
                } else {
                  if (isEditing()) {
                    setText(null);
                  } else {
                    // this is the place where we update data by chosen value
                    setText(getItem().toString());
                    setGraphic(null);
                  }
                }
              }
            };
          return cell;
        }
      });

    tableView.getColumns().addAll(firstNameCol, lastNameCol);
    tableView.setFocusTraversable(false);
    root.getChildren().add(tableView);
  }

  // I've extracted your stage to a separate class for better readability
  private static class CheckBoxTreeStage extends Stage {

    private CheckBoxTreeItem<String> checkBoxTreeItem;
    private CheckBoxTreeItem<String> nodeFieldName;
    private CheckBoxTreeItem<String> nodeFieldName2;
    private CheckBoxTreeItem<String> nodeFieldName3;

    public CheckBoxTreeStage(final TableCell cell) {
      CheckBoxTreeItem<String> rootItem =
        new CheckBoxTreeItem<String>("Tables");
      rootItem.setExpanded(true);

      final TreeView tree = new TreeView(rootItem);
      tree.setEditable(true);

      tree.setCellFactory(CheckBoxTreeCell.<String>forTreeView());
      {
        checkBoxTreeItem = new CheckBoxTreeItem<String>("Sample Table");//+ (i+1));
        rootItem.getChildren().add(checkBoxTreeItem);
        nodeFieldName = new CheckBoxTreeItem<String>("Field Name1");
        nodeFieldName2 = new CheckBoxTreeItem<String>("Field Name2");
        nodeFieldName3 = new CheckBoxTreeItem<String>("Field Name3");
        checkBoxTreeItem.getChildren().addAll(nodeFieldName, nodeFieldName2, nodeFieldName3);

      }
      tree.setRoot(rootItem);
      tree.setShowRoot(true);
      StackPane root = new StackPane();
      root.getChildren().add(tree);
      Button selectButton = new Button("Select");
      HBox hbox = new HBox();
      hbox.getChildren().add(selectButton);
      hbox.setAlignment(Pos.CENTER);
      selectButton.setOnAction(new EventHandler<ActionEvent>() {
          @Override
            public void handle(ActionEvent t) {

            final ArrayList<String> selectedValues = new ArrayList<String>();
            //                                    System.out.println("Selected tree items are : ");
            if (checkBoxTreeItem.isSelected()) {
              selectedValues.add(checkBoxTreeItem.getValue());
            }
            if (nodeFieldName.isSelected()) {
              selectedValues.add(nodeFieldName.getValue());
            }
            if (nodeFieldName2.isSelected()) {
              selectedValues.add(nodeFieldName2.getValue());
            }
            if (nodeFieldName3.isSelected()) {
              selectedValues.add(nodeFieldName3.getValue());
            }
            hide();
            String selectedVals = "";
            for (int i = 0; i < selectedValues.size(); i++) {
              if (i == selectedValues.size() - 1) {
                selectedVals += selectedValues.get(i);
              } else {
                selectedVals += selectedValues.get(i) + ",";
              }
            }
            boolean fieldNameChosen = true;
            if (fieldNameChosen) {
              cell.commitEdit(selectedVals);
            } else {
              cell.cancelEdit();
            }
          }
        });
      BorderPane borderPane = new BorderPane();
      borderPane.setCenter(root);
      borderPane.setBottom(hbox);
      setScene(new Scene(new Group(borderPane)));
    }
  };

  public static class Person {

    private StringProperty firstName;
    private StringProperty lastName;

    private Person(String fName, String lName) {
      this.firstName = new SimpleStringProperty(fName);
      this.lastName = new SimpleStringProperty(lName);
    }

    public StringProperty firstNameProperty() {
      return firstName;
    }

    public StringProperty lastNameProperty() {
      return lastName;
    }
  }

  @Override
  public void start(Stage primaryStage) throws Exception {
    init(primaryStage);
    primaryStage.show();
  }

  public static void main(String[] args) {
    launch(args);
  }
}
