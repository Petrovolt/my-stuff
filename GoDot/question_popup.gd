extends Control

signal answer_selected(answer: String)
signal popup_closed

@onready var question_label = $VBoxContainer/QuestionLabel
@onready var options_container = $VBoxContainer/OptionsContainer
@onready var explanation_label = $VBoxContainer/ExplanationLabel
@onready var close_button = $VBoxContainer/CloseButton

var current_question: Dictionary
var correct_answer: String
var selected_answer: String = ""

func _ready():
	# Initially hide explanation
	explanation_label.visible = false
	close_button.visible = false

func display_question(question_data: Dictionary):
	current_question = question_data
	correct_answer = question_data.get("correct_answer", "")
	selected_answer = ""
	
	# Set question text
	question_label.text = question_data.get("question", "")
	
	# Clear previous options
	for child in options_container.get_children():
		child.queue_free()
	
	# Create option buttons
	var options = question_data.get("options", {})
	for key in ["A", "B", "C", "D"]:
		if options.has(key):
			var button = Button.new()
			button.text = key + ") " + options[key]
			button.custom_minimum_size = Vector2(400, 50)
			button.pressed.connect(_on_option_selected.bind(key))
			options_container.add_child(button)
	
	# Reset UI state
	explanation_label.visible = false
	close_button.visible = false
	explanation_label.text = ""

func _on_option_selected(answer: String):
	selected_answer = answer
	
	# Disable all buttons
	for child in options_container.get_children():
		child.disabled = true
		if child.text.begins_with(answer + ")"):
			if answer == correct_answer:
				child.modulate = Color.GREEN
			else:
				child.modulate = Color.RED
		elif child.text.begins_with(correct_answer + ")"):
			child.modulate = Color.GREEN
	
	# Show explanation
	var explanation = current_question.get("explanation", "")
	explanation_label.text = explanation
	explanation_label.visible = true
	close_button.visible = true
	
	# Emit signal
	answer_selected.emit(answer)

func _on_close_button_pressed():
	popup_closed.emit()
	visible = false

