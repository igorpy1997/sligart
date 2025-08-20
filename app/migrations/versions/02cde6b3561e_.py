"""
Revision ID: 02cde6b3561e
Revises: 33df43e6f4b0
Create Date: 2025-08-20 13:21:56.886310
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '02cde6b3561e'
down_revision: Union[str, None] = '33df43e6f4b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Добавляем столбец с nullable=True
    op.add_column('developers', sa.Column('order_priority', sa.Integer(), nullable=True))

    # Заполняем order_priority для существующих записей (на основе id)
    op.execute("UPDATE developers SET order_priority = id WHERE order_priority IS NULL")

    # Делаем столбец NOT NULL
    op.alter_column('developers', 'order_priority', nullable=False, server_default='0')


def downgrade() -> None:
    # Удаляем столбец при откате
    op.drop_column('developers', 'order_priority')