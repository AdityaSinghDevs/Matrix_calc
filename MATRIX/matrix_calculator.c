#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>

// Structure to store matrix information
typedef struct Matrix {
    char name[50];
    int rows;
    int cols;
    float **data;
    struct Matrix *next;
} Matrix;

// Global linked list to store matrices
Matrix *matrix_list = NULL;

// Function to create a new matrix
Matrix* create_matrix(const char *name, int rows, int cols) {
    Matrix *new_matrix = (Matrix*)malloc(sizeof(Matrix));
    if (!new_matrix) {
        printf("Memory allocation failed!\n");
        return NULL;
    }

    strcpy(new_matrix->name, name);
    new_matrix->rows = rows;
    new_matrix->cols = cols;
    
    // Allocate memory for rows
    new_matrix->data = (float**)malloc(rows * sizeof(float*));
    if (!new_matrix->data) {
        free(new_matrix);
        printf("Memory allocation failed!\n");
        return NULL;
    }

    // Allocate memory for columns in each row
    for (int i = 0; i < rows; i++) {
        new_matrix->data[i] = (float*)malloc(cols * sizeof(float));
        if (!new_matrix->data[i]) {
            // Free previously allocated memory
            for (int j = 0; j < i; j++) {
                free(new_matrix->data[j]);
            }
            free(new_matrix->data);
            free(new_matrix);
            printf("Memory allocation failed!\n");
            return NULL;
        }
    }

    new_matrix->next = NULL;
    return new_matrix;
}

// Function to free matrix memory
void free_matrix(Matrix *matrix) {
    if (!matrix) return;
    
    for (int i = 0; i < matrix->rows; i++) {
        free(matrix->data[i]);
    }
    free(matrix->data);
    free(matrix);
}

// Function to add matrix to the list
void add_matrix_to_list(Matrix *matrix) {
    if (!matrix_list) {
        matrix_list = matrix;
    } else {
        Matrix *current = matrix_list;
        while (current->next) {
            current = current->next;
        }
        current->next = matrix;
    }
}

// Function to find matrix by name
Matrix* find_matrix(const char *name) {
    Matrix *current = matrix_list;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            return current;
        }
        current = current->next;
    }
    return NULL;
}

// Function to input matrix elements
void input_matrix_elements(Matrix *matrix) {
    for (int i = 0; i < matrix->rows; i++) {
        for (int j = 0; j < matrix->cols; j++) {
            scanf("%f", &matrix->data[i][j]);
        }
    }
}

// Function to display matrix
void display_matrix(const Matrix *matrix) {
    if (!matrix) {
        printf("Matrix not found!\n");
        return;
    }

    printf("\nMatrix %s (%dx%d):\n", matrix->name, matrix->rows, matrix->cols);
    for (int i = 0; i < matrix->rows; i++) {
        for (int j = 0; j < matrix->cols; j++) {
            printf("%.2f\t", matrix->data[i][j]);
        }
        printf("\n");
    }
}

// Function to add two matrices
Matrix* add_matrices(const Matrix *m1, const Matrix *m2, const char *result_name) {
    if (m1->rows != m2->rows || m1->cols != m2->cols) {
        printf("Matrix dimensions don't match for addition!\n");
        return NULL;
    }

    Matrix *result = create_matrix(result_name, m1->rows, m1->cols);
    if (!result) return NULL;

    for (int i = 0; i < m1->rows; i++) {
        for (int j = 0; j < m1->cols; j++) {
            result->data[i][j] = m1->data[i][j] + m2->data[i][j];
        }
    }

    return result;
}

// Function to multiply two matrices
Matrix* multiply_matrices(const Matrix *m1, const Matrix *m2, const char *result_name) {
    if (m1->cols != m2->rows) {
        printf("Matrix dimensions don't match for multiplication!\n");
        return NULL;
    }

    Matrix *result = create_matrix(result_name, m1->rows, m2->cols);
    if (!result) return NULL;

    for (int i = 0; i < m1->rows; i++) {
        for (int j = 0; j < m2->cols; j++) {
            result->data[i][j] = 0;
            for (int k = 0; k < m1->cols; k++) {
                result->data[i][j] += m1->data[i][k] * m2->data[k][j];
            }
        }
    }

    return result;
}

// Function to display all matrices
void display_all_matrices() {
    Matrix *current = matrix_list;
    if (!current) {
        printf("No matrices stored.\n");
        return;
    }
    
    while (current) {
        display_matrix(current);
        current = current->next;
    }
}

// Main menu function
void display_menu() {
    printf("\nMatrix Calculator Menu:\n");
    printf("1. Create new matrix\n");
    printf("2. Display matrix\n");
    printf("3. Add matrices\n");
    printf("4. Multiply matrices\n");
    printf("5. Exit\n");
    printf("Enter your choice: ");
}

int main() {
    int choice;
    char name[50], m1_name[50], m2_name[50], result_name[50];
    int rows, cols;
    Matrix *m1, *m2, *result;

    printf("Welcome to Matrix Calculator!\n");

    while (1) {
        display_menu();
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter matrix name: ");
                scanf("%s", name);
                printf("Enter number of rows: ");
                scanf("%d", &rows);
                printf("Enter number of columns: ");
                scanf("%d", &cols);

                Matrix *new_matrix = create_matrix(name, rows, cols);
                if (new_matrix) {
                    input_matrix_elements(new_matrix);
                    add_matrix_to_list(new_matrix);
                    printf("Matrix created successfully!\n");
                }
                break;

            case 2:
                printf("Enter matrix name to display: ");
                scanf("%s", name);
                display_matrix(find_matrix(name));
                break;

            case 3:
                printf("Enter first matrix name: ");
                scanf("%s", m1_name);
                printf("Enter second matrix name: ");
                scanf("%s", m2_name);
                printf("Enter result matrix name: ");
                scanf("%s", result_name);

                m1 = find_matrix(m1_name);
                m2 = find_matrix(m2_name);
                
                if (m1 && m2) {
                    result = add_matrices(m1, m2, result_name);
                    if (result) {
                        add_matrix_to_list(result);
                        printf("Matrices added successfully!\n");
                        display_matrix(result);
                    }
                } else {
                    printf("One or both matrices not found!\n");
                }
                break;

            case 4:
                printf("Enter first matrix name: ");
                scanf("%s", m1_name);
                printf("Enter second matrix name: ");
                scanf("%s", m2_name);
                printf("Enter result matrix name: ");
                scanf("%s", result_name);

                m1 = find_matrix(m1_name);
                m2 = find_matrix(m2_name);
                
                if (m1 && m2) {
                    result = multiply_matrices(m1, m2, result_name);
                    if (result) {
                        add_matrix_to_list(result);
                        printf("Matrices multiplied successfully!\n");
                        display_matrix(result);
                    }
                } else {
                    printf("One or both matrices not found!\n");
                }
                break;

            case 5:
                // Free all allocated memory before exiting
                while (matrix_list) {
                    Matrix *temp = matrix_list;
                    matrix_list = matrix_list->next;
                    free_matrix(temp);
                }
                printf("Thank you for using Matrix Calculator!\n");
                return 0;

            default:
                printf("Invalid choice! Please try again.\n");
        }
    }

    return 0;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    return main();
}
