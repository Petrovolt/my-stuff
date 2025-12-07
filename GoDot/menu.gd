extends Control

@onready var start_button = $Button

var game_manager: Node = null

func _ready():
	start_button.pressed.connect(_on_start_pressed)
	
	# Create game manager node
	game_manager = Node.new()
	game_manager.set_script(preload("res://game_manager.gd"))
	add_child(game_manager)
	game_manager.question_answered.connect(_on_question_answered)
	game_manager.level_complete.connect(_on_level_complete)
	game_manager.boss_fight_started.connect(_on_boss_fight_started)

func _on_start_pressed():
	print("Starting game...")
	start_button.visible = false
	game_manager.start_game()

func _on_question_answered(correct: bool):
	if correct:
		print("Correct answer!")
	else:
		print("Wrong answer!")

func _on_level_complete():
	print("Level complete!")
	var score = game_manager.get_score()
	print("Final Score: ", score.correct, "/", score.total, " (", score.percentage, "%)")
	start_button.visible = true

func _on_boss_fight_started():
	print("BOSS FIGHT!")

