extends Node

signal question_answered(correct: bool)
signal level_complete
signal boss_fight_started

var questions_data: Dictionary = {}
var current_section_index: int = 0
var current_question_index: int = 0
var correct_answers_count: int = 0
var total_questions_answered: int = 0

var question_popup_scene = preload("res://question_popup.tscn")
var question_popup_instance: Control = null

func _ready():
	# Load questions from JSON file
	load_questions_from_file("res://questions.json")

func load_questions_from_file(file_path: String):
	var file = FileAccess.open(file_path, FileAccess.READ)
	if file == null:
		print("Error: Could not open questions file at ", file_path)
		print("Make sure to place questions.json in the GoDot folder")
		return
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var parse_result = json.parse(json_string)
	
	if parse_result != OK:
		print("Error parsing JSON: ", json.get_error_message())
		return
	
	questions_data = json.data
	print("Loaded ", questions_data.get("total_sections", 0), " sections")
	print("Total questions: ", get_total_questions())

func get_total_questions() -> int:
	var total = 0
	if questions_data.has("sections"):
		for section in questions_data["sections"]:
			if section.has("questions"):
				total += section["questions"].size()
	return total

func get_current_question() -> Dictionary:
	if not questions_data.has("sections"):
		return {}
	
	if current_section_index >= questions_data["sections"].size():
		return {}
	
	var section = questions_data["sections"][current_section_index]
	if not section.has("questions"):
		return {}
	
	if current_question_index >= section["questions"].size():
		return {}
	
	return section["questions"][current_question_index]

func show_next_question():
	var question = get_current_question()
	if question.is_empty():
		print("No more questions!")
		level_complete.emit()
		return
	
	# Create popup if it doesn't exist
	if question_popup_instance == null:
		question_popup_instance = question_popup_scene.instantiate()
		get_tree().root.add_child(question_popup_instance)
		question_popup_instance.answer_selected.connect(_on_answer_selected)
		question_popup_instance.popup_closed.connect(_on_popup_closed)
	
	question_popup_instance.visible = true
	question_popup_instance.display_question(question)

func _on_answer_selected(answer: String):
	var question = get_current_question()
	var correct = (answer == question.get("correct_answer", ""))
	
	if correct:
		correct_answers_count += 1
	
	total_questions_answered += 1
	question_answered.emit(correct)
	
	# Check if it's time for a boss fight (every 10 questions)
	if total_questions_answered % 10 == 0:
		boss_fight_started.emit()

func _on_popup_closed():
	# Move to next question
	current_question_index += 1
	
	# Check if we've finished current section
	var section = questions_data["sections"][current_section_index]
	if current_question_index >= section["questions"].size():
		current_section_index += 1
		current_question_index = 0
		
		# Check if all sections are done
		if current_section_index >= questions_data["sections"].size():
			print("All questions completed!")
			level_complete.emit()
			return
	
	# Show next question after a short delay
	await get_tree().create_timer(0.5).timeout
	show_next_question()

func start_game():
	current_section_index = 0
	current_question_index = 0
	correct_answers_count = 0
	total_questions_answered = 0
	show_next_question()

func get_score() -> Dictionary:
	return {
		"correct": correct_answers_count,
		"total": total_questions_answered,
		"percentage": (float(correct_answers_count) / float(total_questions_answered) * 100.0) if total_questions_answered > 0 else 0.0
	}

