#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAX_WORD_LENGTH 50
#define MAX_TRIES 6
#define MAX_PLAYERS 100

struct WordWithHint {
    char word[MAX_WORD_LENGTH];
    char hint[MAX_WORD_LENGTH];
};

struct Player {
    char name[50];
    int score;
};
void refreshScreen() {
    printf("\033[2J");   // clear screen
    printf("\033[H");    // move cursor to top-left
}
// ------------------ HANGMAN DRAW ------------------
void drawHangman(int tries) {

    char board[7][20] = {
        "   +-------+     ",
        "   |       |     ",
        "   |             ",
        "   |             ",
        "   |             ",
        "   |             ",
        "___|_____________"
    };

    if (tries >= 1) board[2][11] = 'O';
    if (tries >= 2) board[3][11] = '|';
    if (tries >= 3) board[3][10] = '/';
    if (tries >= 4) board[3][12] = '\\';
    if (tries >= 5) board[4][10] = '/';
    if (tries >= 6) board[4][12] = '\\';

    printf("\n");
    for (int i = 0; i < 7; i++)
        printf("%s\n", board[i]);
}

// ------------------ DISPLAY WORD ------------------
void displayWord(const char word[], bool guessed[]) {
    for (int i = 0; word[i] != '\0'; i++) {
        if (guessed[word[i] - 'a'])
            printf("%c ", word[i]);
        else
            printf("_ ");
    }
    printf("\n");
}

// ------------------ MAIN ------------------
int main() {

    srand(time(NULL));

    struct WordWithHint easy[10] = {
        {"apple","Fruit"}, {"dog","Animal"}, {"cat","Pet"},
        {"ball","Sport item"}, {"milk","White drink"},
        {"tree","Has leaves"}, {"fish","Lives in water"},
        {"book","For reading"}, {"star","Shines at night"},
        {"shoe","Worn on feet"}
    };

    struct WordWithHint medium[10] = {
        {"planet","Earth is one"}, {"guitar","Music instrument"},
        {"rocket","Goes to space"}, {"python","Programming"},
        {"school","Place to learn"}, {"bridge","Connects places"},
        {"camera","Takes photos"}, {"silver","Metal"},
        {"doctor","Treats people"}, {"jungle","Dense forest"}
    };

    struct WordWithHint hard[10] = {
        {"javascript","Web language"}, {"algorithm","Step process"},
        {"developer","Writes code"}, {"framework","Development structure"},
        {"database","Stores data"}, {"processor","Computer brain"},
        {"encryption","Secures data"}, {"interface","User interaction"},
        {"cybersecurity","Digital protection"}, {"artificial","Not natural"}
    };

    struct Player leaderboard[MAX_PLAYERS];
    int playerCount = 0;

    char playerName[50];
    int difficulty;
    int timeLimit;

    printf("Enter Player Name: ");
    scanf("%s", playerName);

    printf("\nSelect Difficulty:\n");
    printf("1. Easy (45 sec)\n");
    printf("2. Medium (90 sec)\n");
    printf("3. Hard (120 sec)\n");
    printf("Choice: ");
    scanf("%d", &difficulty);

    if (difficulty == 1) timeLimit = 45;
    else if (difficulty == 2) timeLimit = 90;
    else timeLimit = 120;

    struct WordWithHint chosenWord;

    if (difficulty == 1)
        chosenWord = easy[rand() % 10];
    else if (difficulty == 2)
        chosenWord = medium[rand() % 10];
    else
        chosenWord = hard[rand() % 10];

    char* secretWord = chosenWord.word;
    int length = strlen(secretWord);

    bool guessed[26] = {false};
    int tries = 0;

    time_t startTime = time(NULL);

    printf("\nHint: %s\n", chosenWord.hint);

    while (tries < MAX_TRIES) {

        int timeElapsed = (int)(time(NULL) - startTime);
        int remaining = timeLimit - timeElapsed;

        if (remaining <= 0) {
            printf("\n⏰ Time Up!\n");
            break;
        }

        printf("\nTime Left: %d sec\n", remaining);
        displayWord(secretWord, guessed);
        drawHangman(tries);
        printf("Enter letter: ");
        char guess;
        scanf(" %c", &guess);
        guess = tolower(guess);

        if (!isalpha(guess)) continue;

        if (guessed[guess - 'a']) {
            printf("Already guessed!\n");
            continue;
        }

        guessed[guess - 'a'] = true;

        bool found = false;
        for (int i = 0; i < length; i++) {
            if (secretWord[i] == guess)
                found = true;
        }

        if (!found) {
            tries++;
            printf("Wrong Guess!\n");
        } else {
            printf("Correct!\n");
        }

        bool won = true;
        for (int i = 0; i < length; i++) {
            if (!guessed[secretWord[i] - 'a'])
                won = false;
        }

        if (won) {
            int score = remaining;
            printf("\n🎉 You Won! Score: %d\n", score);

            strcpy(leaderboard[playerCount].name, playerName);
            leaderboard[playerCount].score = score;
            playerCount++;
            break;
        }
    }

    if (tries == MAX_TRIES) {
        drawHangman(6);
        printf("\n❌ Game Over! Word was: %s\n", secretWord);
    }

    // Show Leaderboard
    printf("\n🏆 Leaderboard:\n");
    for (int i = 0; i < playerCount; i++) {
        printf("%s - %d\n", leaderboard[i].name, leaderboard[i].score);
    }

    return 0;
}
